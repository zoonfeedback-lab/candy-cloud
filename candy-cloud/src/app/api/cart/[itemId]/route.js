import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Cart from "@/models/Cart";

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { itemId } = await params;
        const { quantity } = await request.json();

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
        }

        const itemIndex = cart.items.findIndex((i) => i.product === itemId);
        if (itemIndex === -1) {
            return NextResponse.json({ success: false, message: "Item not found in cart" }, { status: 404 });
        }

        if (quantity < 1) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { itemId } = await params;

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
        }

        const itemIndex = cart.items.findIndex((i) => i.product === itemId);
        if (itemIndex === -1) {
            return NextResponse.json({ success: false, message: "Item not found in cart" }, { status: 404 });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        return handleError(error);
    }
}
