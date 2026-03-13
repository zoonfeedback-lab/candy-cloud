import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";

export async function POST(request) {
    try {
        await connectDB();
        const authUser = await requireAuth(request);
        const user = await User.findById(authUser.id);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (!user.activeReward || !user.activeReward.label) {
            return NextResponse.json({ success: false, message: "No active reward to redeem" }, { status: 400 });
        }

        user.activeReward = {
            label: null,
            discountType: null,
            discountValue: 0,
            wonAt: null,
        };
        await user.save();

        return NextResponse.json({ success: true, message: "Reward redeemed successfully!" });
    } catch (error) {
        return handleError(error);
    }
}
