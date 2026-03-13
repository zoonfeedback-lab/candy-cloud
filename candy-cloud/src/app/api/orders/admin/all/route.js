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
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;

        const filter = {};
        if (status) filter.orderStatus = status;

        const orders = await Order.find(filter)
            .populate("user", "name email phone")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        return NextResponse.json({
            success: true,
            count: orders.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            orders,
        });
    } catch (error) {
        return handleError(error);
    }
}
