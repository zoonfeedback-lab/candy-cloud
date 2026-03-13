import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(request) {
    try {
        await connectDB();
        await requireAdmin(request);

        const orderAggregation = await Order.aggregate([
            { $match: { orderStatus: { $ne: "cancelled" } } },
            { $group: { _id: null, totalSales: { $sum: "$total" }, totalOrders: { $sum: 1 } } },
        ]);

        const stats = orderAggregation[0] || { totalSales: 0, totalOrders: 0 };
        const totalSales = stats.totalSales;
        const totalOrders = stats.totalOrders;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        const goldenScoopsFound = await User.countDocuments({ hasSpun: true });

        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const formattedOrders = recentOrders.map((order) => ({
            id: order.orderNumber,
            customerName: order.shippingAddress?.firstName
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                : order.user?.name || "Unknown",
            date: order.createdAt,
            amount: order.total,
            status: order.orderStatus,
        }));

        const inventory = await Product.find({ isActive: true })
            .sort({ stock: 1 })
            .limit(3)
            .select("name price stock category")
            .lean();

        const totalScoopsLimit = 60;
        const scoopsRemaining = Math.max(0, totalScoopsLimit - goldenScoopsFound);

        const jackpotAgg = await Order.aggregate([
            { $match: { discount: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$discount" } } },
        ]);
        const currentJackpot = jackpotAgg[0] ? jackpotAgg[0].total : 500;

        const latestWinners = await User.find({ hasSpun: true })
            .select("name")
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        const goldenScoopPanel = {
            scoopsRemaining,
            totalScoops: totalScoopsLimit,
            currentJackpot,
            latestWinners: latestWinners.map((u) => ({
                name: u.name,
                initials: u.name ? u.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "US",
            })),
        };

        return NextResponse.json({
            success: true,
            kpis: { totalSales, totalOrders, avgOrderValue, goldenScoopsFound },
            recentOrders: formattedOrders,
            inventory,
            goldenScoopPanel,
        });
    } catch (error) {
        return handleError(error);
    }
}
