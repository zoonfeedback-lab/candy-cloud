import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Wishlist from "@/models/Wishlist";

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { productId } = params;

        const wishlist = await Wishlist.findOne({ user: user._id });
        if (wishlist) {
            wishlist.items = wishlist.items.filter((item) => item.productId !== productId);
            await wishlist.save();
        }

        return NextResponse.json({ success: true, wishlist });
    } catch (error) {
        return handleError(error);
    }
}
