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
            .select("name price stock")
            .lean();

        res.status(200).json({
            success: true,
            kpis: {
                totalSales,
                totalOrders,
                avgOrderValue,
                goldenScoopsFound
            },
            recentOrders: formattedOrders,
            inventory
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
