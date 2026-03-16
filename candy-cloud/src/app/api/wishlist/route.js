import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Wishlist from "@/models/Wishlist";

export async function GET(request) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        let wishlist = await Wishlist.findOne({ user: user._id });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: user._id, items: [] });
        }
        return NextResponse.json({ success: true, wishlist });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { productId, name, emoji, type, description } = await request.json();

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        let wishlist = await Wishlist.findOne({ user: user._id });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: user._id, items: [] });
        }

        const existingItem = wishlist.items.find((item) => item.productId === productId);

        if (!existingItem) {
            wishlist.items.push({ productId, name, emoji, type, description });
            await wishlist.save();
        }

        return NextResponse.json({ success: true, wishlist });
    } catch (error) {
        return handleError(error);
    }
}
