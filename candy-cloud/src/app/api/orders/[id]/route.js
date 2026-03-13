import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Order from "@/models/Order";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { id } = await params;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        if (order.user.toString() !== user._id.toString() && user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Not authorized to view this order" }, { status: 403 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        return handleError(error);
    }
}
