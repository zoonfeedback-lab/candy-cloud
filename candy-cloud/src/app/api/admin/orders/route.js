import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Order from "@/models/Order";

export async function GET(request) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";

        const query = {};

        if (status && status !== "all") {
            if (status === "Sorting") query.orderStatus = { $in: ["placed", "processing"] };
            else if (status === "Stork Transit") query.orderStatus = { $in: ["shipped", "out_for_delivery"] };
            else if (status === "Delivered") query.orderStatus = "delivered";
            else if (status === "Magic Fail") query.orderStatus = "cancelled";
            else query.orderStatus = status;
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { "shippingAddress.firstName": { $regex: search, $options: "i" } },
                { "shippingAddress.lastName": { $regex: search, $options: "i" } },
            ];
        }

        const totalOrdersFiltered = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate("user", "name email hasSpun activeReward")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const formattedOrders = orders.map((order) => {
            let itemsSummary = "No items";
            let itemsNote = "";
            if (order.items && order.items.length > 0) {
                const firstItemName = order.items[0].name;
                const remainingCount = order.items.length - 1;
                itemsSummary = remainingCount > 0 ? `${firstItemName} + ${remainingCount}` : `${firstItemName} (x${order.items[0].quantity})`;
                if (firstItemName === "Custom Bundle") itemsSummary = "Custom Bundle";
                itemsNote = order.items[0].description || "";
            }

            return {
                _id: order._id,
                id: order.orderNumber,
                customerName: order.shippingAddress?.firstName
                    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                    : order.user?.name || "Unknown",
                date: order.createdAt,
                amount: order.total,
                status: order.orderStatus,
                itemsSummary,
                itemsNote,
                isGoldenScoop: order.user?.hasSpun || order.couponCode ? true : false,
            };
        });

        const totalOrdersGlobal = await Order.countDocuments();
        const pendingSorting = await Order.countDocuments({ orderStatus: { $in: ["placed", "processing"] } });
        const inTransit = await Order.countDocuments({ orderStatus: { $in: ["shipped", "out_for_delivery"] } });
        const goldenScoopOrders = await Order.countDocuments({
            $or: [{ discount: { $gt: 0 } }, { couponCode: { $exists: true, $ne: null } }],
        });

        return NextResponse.json({
            success: true,
            kpis: { totalOrders: totalOrdersGlobal, pendingSorting, inTransit, goldenScoopOrders },
            pagination: { currentPage: page, totalPages: Math.ceil(totalOrdersFiltered / limit), totalOrders: totalOrdersFiltered },
            orders: formattedOrders,
        });
    } catch (error) {
        return handleError(error);
    }
}
