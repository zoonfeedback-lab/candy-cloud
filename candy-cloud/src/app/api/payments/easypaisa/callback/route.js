import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

        if (data.transactionStatus !== "PAID" && data.transactionStatus !== "SUCCESS") {
            const reason = data.message || "Payment Failed";
            console.error("EasyPaisa Payment Failed:", reason);
            return NextResponse.redirect(`${baseUrl}/payment/error?reason=${encodeURIComponent(reason)}`);
        }

        const billRef = data.orderId || "";
        const orderId = billRef.replace("CC-ORD-", "");

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid" });
        }

        return NextResponse.redirect(`${baseUrl}/success?gateway=easypaisa`);
    } catch (error) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        return NextResponse.redirect(`${baseUrl}/payment/error?reason=server_error`);
    }
}
