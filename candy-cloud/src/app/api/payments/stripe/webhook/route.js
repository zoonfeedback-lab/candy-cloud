import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.text();
        const sig = request.headers.get("stripe-signature");

        let event;
        try {
            event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;

            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: "paid",
                    stripePaymentIntentId: paymentIntent.id,
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
