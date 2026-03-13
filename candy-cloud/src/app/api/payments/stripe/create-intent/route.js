import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        await connectDB();
        await requireAuth(request);
        const { amount, orderId } = await request.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "pkr",
            metadata: { orderId },
        });

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        return handleError(error);
    }
}
