const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        // 1. Get KPI numbers
        // Total Sales (sum of 'total' from all delivered/shipped/processing orders, we can just sum all non-cancelled for now)
        const orderAggregation = await Order.aggregate([
            { $match: { orderStatus: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" },
                    totalOrders: { $sum: 1 },
                }
            }
        ]);

        const stats = orderAggregation[0] || { totalSales: 0, totalOrders: 0 };
        const totalSales = stats.totalSales;
        const totalOrders = stats.totalOrders;
        const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders) : 0;

        // 2. Count Golden Scoops (Count users who have `hasSpun: true`)
        const goldenScoopsFound = await User.countDocuments({ hasSpun: true });

        // 3. Get Recent Orders
        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Format recent orders for frontend
        const formattedOrders = recentOrders.map(order => ({
            id: order.orderNumber,
            customerName: order.shippingAddress?.firstName
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                : (order.user?.name || "Unknown"),
            date: order.createdAt,
            amount: order.total,
            status: order.orderStatus,
        }));

        // 4. Get Inventory Status
        // Get top 3 featured or popular products to monitor
        const inventory = await Product.find({ isActive: true })
            .sort({ stock: 1 }) // Show low stock first
            .limit(3)
            .select("name price stock category")
            .lean();

        // 5. Get Golden Scoop Campaign Data for the panel
        const totalScoopsLimit = 60;
        const scoopsUsed = goldenScoopsFound;
        const scoopsRemaining = Math.max(0, totalScoopsLimit - scoopsUsed);

        // Sum total discounts given to calculate real jackpot
        const jackpotAgg = await Order.aggregate([
            { $match: { discount: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$discount" } } }
        ]);
        const currentJackpot = jackpotAgg[0] ? jackpotAgg[0].total : 500;

        // Get latest 3 winners (users who spun)
        const latestWinners = await User.find({ hasSpun: true })
            .select("name")
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        const goldenScoopPanel = {
            scoopsRemaining,
            totalScoops: totalScoopsLimit,
            currentJackpot,
            latestWinners: latestWinners.map(u => ({
                name: u.name,
                initials: u.name ? u.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "US"
            }))
        };

        res.status(200).json({
            success: true,
            kpis: {
                totalSales,
                totalOrders,
                avgOrderValue,
                goldenScoopsFound
            },
            recentOrders: formattedOrders,
            inventory,
            goldenScoopPanel
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Admin Orders (Paginated, Filtered, with KPIs)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAdminOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, status } = req.query;

        // 1. Build Query for main orders table
        const query = {};

        if (status && status !== "all") {
            // Map frontend statuses to backend enums if necessary, or just use exact matches
            if (status === "Sorting") {
                query.orderStatus = { $in: ["placed", "processing"] };
            } else if (status === "Stork Transit") {
                query.orderStatus = { $in: ["shipped", "out_for_delivery"] };
            } else if (status === "Delivered") {
                query.orderStatus = "delivered";
            } else if (status === "Magic Fail") {
                query.orderStatus = "cancelled";
            } else {
                query.orderStatus = status;
            }
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { "shippingAddress.firstName": { $regex: search, $options: "i" } },
                { "shippingAddress.lastName": { $regex: search, $options: "i" } }
            ];
        }

        // 2. Execute Query with Pagination
        const totalOrdersFiltered = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate("user", "name email hasSpun activeReward")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // 3. Format Orders for Frontend
        const formattedOrders = orders.map(order => {
            // Create a summary string of items (e.g., "Sweet Treat Box + 2")
            let itemsSummary = "No items";
            if (order.items && order.items.length > 0) {
                const firstItemName = order.items[0].name;
                const remainingCount = order.items.length - 1;
                itemsSummary = remainingCount > 0
                    ? `${firstItemName} + ${remainingCount}`
                    : `${firstItemName} (x${order.items[0].quantity})`;

                // If it's the direct bundle logic
                if (firstItemName === "Custom Bundle") {
                    itemsSummary = "Custom Bundle";
                }
            }

            // Determine if it was a Golden Scoop order (either user spun or coupon was applied)
            const isGoldenScoop = order.user?.hasSpun || order.couponCode ? true : false;

            return {
                _id: order._id,
                id: order.orderNumber,
                customerName: order.shippingAddress?.firstName
                    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                    : (order.user?.name || "Unknown"),
                date: order.createdAt,
                amount: order.total,
                status: order.orderStatus,
                itemsSummary: itemsSummary,
                isGoldenScoop: isGoldenScoop
            };
        });

        // 4. Calculate KPIs (Global, ignoring search filters)
        // Note: Running these separately to ensure the top KPI cards always reflect global state

        const totalOrdersGlobal = await Order.countDocuments();

        const pendingSorting = await Order.countDocuments({
            orderStatus: { $in: ["placed", "processing"] }
        });

        const inTransit = await Order.countDocuments({
            orderStatus: { $in: ["shipped", "out_for_delivery"] }
        });

        // Define a golden scoop order as one placed by a user who has spun, or an order with a discount
        const goldenScoopOrders = await Order.countDocuments({
            $or: [
                { discount: { $gt: 0 } },
                { couponCode: { $exists: true, $ne: null } }
            ]
        });

        res.status(200).json({
            success: true,
            kpis: {
                totalOrders: totalOrdersGlobal,
                pendingSorting,
                inTransit,
                goldenScoopOrders
            },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrdersFiltered / limit),
                totalOrders: totalOrdersFiltered
            },
            orders: formattedOrders
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get Admin Inventory (Paginated, Filtered, with KPIs)
// @route   GET /api/admin/inventory
// @access  Private/Admin
exports.getAdminInventory = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, category, stockStatus } = req.query;

        // 1. Build Query for main inventory table
        const query = {};

        if (category && category !== "all") {
            query.category = category;
        }

        if (stockStatus && stockStatus !== "all") {
            if (stockStatus === "in_stock") {
                query.stock = { $gt: 20 };
            } else if (stockStatus === "low_stock") {
                query.stock = { $gt: 0, $lte: 20 };
            } else if (stockStatus === "out_of_stock") {
                query.stock = 0;
            }
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
                // If SKU existed on model, we'd add it here
            ];
        }

        // 2. Execute Query with Pagination
        const totalItemsFiltered = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // 3. Format Products for Frontend
        // We simulate SKU here since it's not strictly in the current schema
        const formattedProducts = products.map(product => {
            const shortCat = product.category ? product.category.split(" ").map(w => w[0]).join("").toUpperCase() : "CC";
            const sku = `SKU-${shortCat}-${product._id.toString().substring(product._id.toString().length - 3)}`;

            let stockLevelStatus = "in_stock";
            if (product.stock === 0) stockLevelStatus = "out_of_stock";
            else if (product.stock <= 20) stockLevelStatus = "low_stock";

            return {
                id: product._id,
                name: product.name,
                category: product.category || "Uncategorized",
                sku: sku,
                price: product.price,
                stock: product.stock,
                stockStatus: stockLevelStatus
            };
        });

        // 4. Calculate KPIs (Global Category Stock Summaries)
        // Sweet Treat Box
        const sweetTreats = await Product.find({ category: "Sweet Treat Box" }).select("stock");
        const stTotalItems = sweetTreats.length;
        const stTotalStock = sweetTreats.reduce((sum, item) => sum + item.stock, 0);
        const stStatus = stTotalStock === 0 ? "Out of Stock" : (stTotalStock < 30 ? "Low Stock" : "Healthy");

        // Dreamy Delight Box
        const dreamyDelight = await Product.find({ category: "Dreamy Delight Box" }).select("stock");
        const ddTotalItems = dreamyDelight.length;
        const ddTotalStock = dreamyDelight.reduce((sum, item) => sum + item.stock, 0);
        const ddStatus = ddTotalStock === 0 ? "Out of Stock" : (ddTotalStock < 30 ? "Low Stock" : "Healthy");

        // Cloud Nine Box
        const cloudNine = await Product.find({ category: "Cloud Nine Box" }).select("stock");
        const cnTotalItems = cloudNine.length;
        const cnTotalStock = cloudNine.reduce((sum, item) => sum + item.stock, 0);
        const cnStatus = cnTotalStock === 0 ? "Out of Stock" : (cnTotalStock < 30 ? "Low Stock" : "Healthy");

        res.status(200).json({
            success: true,
            kpis: {
                sweetTreat: { items: stTotalItems, status: stStatus },
                dreamyDelight: { items: ddTotalItems, status: ddStatus },
                cloudNine: { items: cnTotalItems, status: cnStatus }
            },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalItemsFiltered / limit),
                totalItems: totalItemsFiltered
            },
            inventory: formattedProducts
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get Admin Customer Details (Profile, Orders, KPIs, Journey)
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
exports.getAdminCustomerDetails = async (req, res, next) => {
    try {
        const customerId = req.params.id;

        // 1. Fetch User Profile
        const customer = await User.findById(customerId).select("-password").lean();

        if (!customer) {
            return res.status(404).json({ success: false, error: "Customer not found" });
        }

        // 2. Fetch All Orders for this User
        const orders = await Order.find({ user: customerId })
            .sort({ createdAt: -1 })
            .lean();

        // 3. Calculate KPIs
        const totalOrders = orders.length;
        // Sum total of all non-cancelled orders
        const totalSpent = orders
            .filter(o => o.orderStatus !== "cancelled")
            .reduce((sum, order) => sum + order.total, 0);

        const avgOrderValue = totalOrders > 0 ? (totalSpent / totalOrders) : 0;

        // Mocking magic points as Total Spent * 2 for now
        const magicPoints = Math.floor(totalSpent * 2);

        // 4. Format Order History for Table
        const formattedOrders = orders.map(order => ({
            id: order.orderNumber,
            date: order.createdAt,
            amount: order.total,
            status: order.orderStatus
        }));

        // 5. Build Magic Journey Timeline
        const journey = [];

        // Base milestone: Account Creation
        journey.push({
            id: "joined",
            title: "Joined Newsletter", // Simulating this as account creation step
            description: "Subscribed to \"Sweet Treats Weekly\"",
            date: customer.createdAt
        });

        // First Order milestone
        if (orders.length > 0) {
            // orders are sorted newest first, so last is oldest
            const firstOrder = orders[orders.length - 1];

            // Try to grab the first item name for flavor text
            let firstItemFlavor = "their first treat";
            if (firstOrder.items && firstOrder.items.length > 0) {
                firstItemFlavor = firstOrder.items[0].name;
            }

            journey.push({
                id: "first_order",
                title: "First Order Placed",
                description: `Order #${firstOrder.orderNumber.slice(-6).toUpperCase()} - ${firstItemFlavor}`,
                date: firstOrder.createdAt
            });
        }

        // Golden Scoop milestone
        if (customer.hasSpun) {
            // Try to find the order that had a discount/golden scoop applied
            const goldenOrder = orders.find(o => o.discount > 0 || o.couponCode);
            // Default to account creation date + 1 day if not found directly
            const spinDate = goldenOrder ? goldenOrder.createdAt : new Date(customer.createdAt.getTime() + 86400000);

            journey.push({
                id: "golden_scoop",
                title: "Won a Golden Scoop",
                description: `Reached ${magicPoints} points milestone`,
                date: spinDate
            });
        }

        // Sort journey newest first (descending)
        journey.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 6. Format Profile data
        // For location and phone, we use the shipping address of their most recent order if it exists, otherwise use placeholders
        let phone = "+1 (555) 000-0000";
        let location = "Unknown Location";

        if (orders.length > 0 && orders[0].shippingAddress) {
            const addr = orders[0].shippingAddress;
            if (addr.phone) phone = addr.phone;
            if (addr.city && addr.state) {
                location = `${addr.city}, ${addr.state}`;
            } else if (addr.city) {
                location = addr.city;
            }
        }

        const profile = {
            id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: phone,
            location: location,
            memberSince: customer.createdAt,
            isGoldenScoopWinner: customer.hasSpun || false
        };

        res.status(200).json({
            success: true,
            profile,
            kpis: {
                totalSpent,
                totalOrders,
                avgOrderValue,
                magicPoints
            },
            orders: formattedOrders,
            journey
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get Admin Golden Scoop Management Data
// @route   GET /api/admin/golden-scoop
// @access  Private/Admin
exports.getAdminGoldenScoop = async (req, res, next) => {
    try {
        // 1. Fetch Golden Scoop Winners (Users who have spun)
        const winners = await User.find({ hasSpun: true })
            .select("name email createdAt")
            .sort({ createdAt: -1 })
            .lean();

        // 2. Format Winners List 
        // We'll also try to fetch their associated order to get the Order ID and Reward amount
        // Since we don't strictly track the exact reward value per user in the schema yet, we'll derive/mock it from recent orders
        const formattedWinners = [];

        for (const user of winners) {
            // Find an order for this user that had a discount
            const order = await Order.findOne({ user: user._id, discount: { $gt: 0 } }).lean()
                || await Order.findOne({ user: user._id }).sort({ createdAt: -1 }).lean();

            // Determine Reward String
            let rewardStr = "$10 Credit"; // Fallback
            if (user.activeReward && user.activeReward.label) {
                rewardStr = user.activeReward.label;
            } else if (order && order.discount > 0) {
                rewardStr = `$${order.discount.toFixed(2)} Credit`;
            }

            formattedWinners.push({
                id: user._id.toString().substring(user._id.toString().length - 4), // Short derived ID
                date: order ? order.createdAt : user.createdAt,
                customerName: user.name,
                orderId: order ? `#ORD-${order.orderNumber.slice(-4).toUpperCase()}` : "N/A",
                reward: rewardStr
            });
        }

        // 3. Campaign Status KPIs
        const totalScoopsAssigned = 60; // Hardcoded max limit for the "campaign"
        const scoopsRemaining = Math.max(0, totalScoopsAssigned - winners.length);
        const winProbability = 2.0; // Hardcoded display value for the mockup

        // Sum total discounts given
        const totalJackpotGiven = await Order.aggregate([
            { $match: { discount: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$discount" } } }
        ]);
        const currentJackpot = totalJackpotGiven[0] ? totalJackpotGiven[0].total : 500.00; // Default to 500 if zero to match mockup feel

        const campaign = {
            status: "Active",
            winProbability,
            totalScoops: totalScoopsAssigned,
            scoopsRemaining,
            currentJackpot
        };

        // 4. Bar Chart Data (Weekly Performance Mockup)
        // We generate realistic looking mock data for the 7 bars
        const chartData = {
            MON: 45,
            TUE: 80,
            WED: 35,
            THU: 60,
            FRI: 55,
            SAT: 95,
            SUN: 25
        };

        // Total campaign orders (Mock stat matching the UI)
        const totalCampaignOrders = await Order.countDocuments();

        res.status(200).json({
            success: true,
            campaign,
            winners: formattedWinners,
            chartData,
            stats: {
                weeklyPerformance: "+12%",
                campaignOrders: totalCampaignOrders > 0 ? totalCampaignOrders : 2410
            }
        });

    } catch (error) {
        next(error);
    }
};
