import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { handleError } from "@/lib/apiError";
import Order from "@/models/Order";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = await params;
        const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase() });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found. Please check your order number." }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                shippingMethod: order.shippingMethod,
                estimatedDelivery: order.estimatedDelivery,
                trackingHistory: order.trackingHistory,
                items: order.items,
                total: order.total,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
