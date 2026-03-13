import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Order from "@/models/Order";

export async function PUT(request, { params }) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { id } = await params;
        const { status, message } = await request.json();

        const validStatuses = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
        }

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        if (["delivered", "cancelled"].includes(order.orderStatus)) {
            return NextResponse.json({ success: false, message: `Cannot update a ${order.orderStatus} order` }, { status: 400 });
        }

        const defaultMessages = {
            confirmed: "Order has been confirmed and is being prepared",
            processing: "Order is being packed with love 💖",
            shipped: "Order has been shipped! On its way to you",
            out_for_delivery: "Order is out for delivery — almost there!",
            delivered: "Order has been delivered. Enjoy your goodies! 🎉",
            cancelled: "Order has been cancelled",
        };

        order.orderStatus = status;
        order.trackingHistory.push({
            status,
            message: message || defaultMessages[status] || `Status updated to ${status}`,
            timestamp: new Date(),
        });

        if (status === "delivered" && order.paymentMethod === "cod") {
            order.paymentStatus = "paid";
        }

        await order.save();
        return NextResponse.json({ success: true, order });
    } catch (error) {
        return handleError(error);
    }
}
