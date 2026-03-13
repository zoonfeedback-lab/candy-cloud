import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";

export async function GET(request) {
    try {
        await connectDB();
        const authUser = await requireAuth(request);
        const user = await User.findById(authUser.id);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (!user.activeReward || !user.activeReward.label) {
            return NextResponse.json({ success: true, reward: null });
        }

        return NextResponse.json({
            success: true,
            reward: {
                label: user.activeReward.label,
                discountType: user.activeReward.discountType,
                discountValue: user.activeReward.discountValue,
                wonAt: user.activeReward.wonAt,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
