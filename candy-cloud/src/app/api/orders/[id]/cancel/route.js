import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Order from "@/models/Order";

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { id } = await params;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        if (order.user.toString() !== user._id.toString()) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        if (!["placed", "confirmed"].includes(order.orderStatus)) {
            return NextResponse.json({ success: false, message: `Cannot cancel an order that is already ${order.orderStatus}` }, { status: 400 });
        }

        const body = await request.json().catch(() => ({}));

        order.orderStatus = "cancelled";
        order.trackingHistory.push({
            status: "cancelled",
            message: body.reason || "Order cancelled by customer",
            timestamp: new Date(),
        });

        await order.save();
        return NextResponse.json({ success: true, message: "Order cancelled", order });
    } catch (error) {
        return handleError(error);
    }
}
