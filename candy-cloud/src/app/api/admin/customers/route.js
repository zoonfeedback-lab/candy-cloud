import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(request) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 15;
        const skip = (page - 1) * limit;
        const search = searchParams.get("search") || "";

        const query = { role: { $ne: "admin" } };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const totalCustomers = await User.countDocuments(query);
        const customers = await User.find(query)
            .select("name email phone createdAt hasSpun activeReward")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const customerIds = customers.map((c) => c._id);
        const orderStats = await Order.aggregate([
            { $match: { user: { $in: customerIds } } },
            {
                $group: {
                    _id: "$user",
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$total" },
                    lastOrderDate: { $max: "$createdAt" },
                    lastCity: { $last: "$shippingAddress.city" },
                },
            },
        ]);

        const statsMap = {};
        orderStats.forEach((s) => { statsMap[s._id.toString()] = s; });

        const formattedCustomers = customers.map((c) => {
            const stats = statsMap[c._id.toString()] || {};
            return {
                id: c._id,
                name: c.name,
                email: c.email,
                phone: c.phone || "—",
                joinedAt: c.createdAt,
                totalOrders: stats.totalOrders || 0,
                totalSpent: stats.totalSpent || 0,
                lastOrderDate: stats.lastOrderDate || null,
                location: stats.lastCity || "—",
                isGoldenScoop: c.hasSpun || false,
            };
        });

        const totalCustomersGlobal = await User.countDocuments({ role: { $ne: "admin" } });
        const goldenScoopWinners = await User.countDocuments({ role: { $ne: "admin" }, hasSpun: true });

        const spendAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
        ]);
        const totalRevenue = spendAgg[0]?.total || 0;
        const avgOrderValue = spendAgg[0]?.count > 0 ? Math.round(totalRevenue / spendAgg[0].count) : 0;

        return NextResponse.json({
            success: true,
            kpis: { totalCustomers: totalCustomersGlobal, goldenScoopWinners, avgOrderValue },
            customers: formattedCustomers,
            pagination: { currentPage: page, totalPages: Math.ceil(totalCustomers / limit), totalItems: totalCustomers },
        });
    } catch (error) {
        return handleError(error);
    }
}
