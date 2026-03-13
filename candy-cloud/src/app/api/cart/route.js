import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Cart from "@/models/Cart";

export async function GET(request) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] });
        }
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { productId, name, emoji, price, quantity = 1, description } = await request.json();

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] });
        }

        const existingItem = cart.items.find((item) => item.product === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, name, emoji, price, quantity, description });
        }

        await cart.save();
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const cart = await Cart.findOne({ user: user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return NextResponse.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        return handleError(error);
    }
}
