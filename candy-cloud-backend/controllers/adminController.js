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
