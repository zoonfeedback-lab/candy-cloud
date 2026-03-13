import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import Setting from "@/models/Setting";

export async function GET(request) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: orders.length, orders });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const {
            items, subtotal, shippingCost, discountAmt, couponCode,
            total, shippingAddress, shippingMethod, paymentMethod,
        } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "No order items" }, { status: 400 });
        }

        if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
            return NextResponse.json({ success: false, message: "Incomplete shipping address provided" }, { status: 400 });
        }

        const settingsRaw = await Setting.find();
        const settings = settingsRaw.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});

        if (paymentMethod === "cod" && (settings.codEnabled === false || settings.codEnabled === 'false')) return NextResponse.json({ success: false, message: "Cash on Delivery is currently disabled" }, { status: 400 });
        if (paymentMethod === "stripe" && (settings.stripeEnabled === false || settings.stripeEnabled === 'false')) return NextResponse.json({ success: false, message: "Stripe payments are currently disabled" }, { status: 400 });
        if (paymentMethod === "jazzcash" && (settings.jazzCashEnabled === false || settings.jazzCashEnabled === 'false')) return NextResponse.json({ success: false, message: "JazzCash payments are currently disabled" }, { status: 400 });
        if (paymentMethod === "easypaisa" && (settings.easypaisaEnabled === false || settings.easypaisaEnabled === 'false')) return NextResponse.json({ success: false, message: "EasyPaisa payments are currently disabled" }, { status: 400 });

        const now = new Date();
        const deliveryDays = shippingMethod === "express" ? 3 : 7;
        const estimatedDelivery = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);

        let finalShippingCost = shippingCost;
        if (shippingMethod === "express" && settings.expressRate) {
            finalShippingCost = Number(settings.expressRate);
        } else if (shippingMethod === "standard") {
            finalShippingCost = 0;
        }

        const order = await Order.create({
            user: user._id,
            items, subtotal,
            shippingCost: finalShippingCost,
            discountAmt: discountAmt || 0,
            couponCode: couponCode || null,
            total: subtotal + finalShippingCost - (discountAmt || 0),
            shippingAddress, shippingMethod, paymentMethod,
            estimatedDelivery,
            paymentStatus: "pending",
        });

        if (couponCode) {
            await Coupon.findOneAndUpdate(
                { code: couponCode.toUpperCase(), user: user._id },
                { isUsed: true }
            );
        }

        await Cart.findOneAndUpdate({ user: user._id }, { items: [] });

        return NextResponse.json({ success: true, order }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
