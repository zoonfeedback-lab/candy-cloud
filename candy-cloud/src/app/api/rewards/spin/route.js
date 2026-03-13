import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";

const PRIZES = [
    { label: "Mystery Item 3", discountType: "item", discountValue: 0, weight: 10 },
    { label: "10% OFF", discountType: "percentage", discountValue: 10, weight: 30 },
    { label: "Mystery Item 1", discountType: "item", discountValue: 0, weight: 10 },
    { label: "Free Shipping", discountType: "fixed", discountValue: 500, weight: 20 },
    { label: "Mystery Item 2", discountType: "item", discountValue: 0, weight: 10 },
    { label: "Free Sticker", discountType: "item", discountValue: 0, weight: 20 },
];

export async function POST(request) {
    try {
        await connectDB();
        const authUser = await requireAuth(request);
        const user = await User.findById(authUser.id);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.hasSpun) {
            return NextResponse.json({ success: false, message: "You've already claimed your welcome reward!" }, { status: 403 });
        }

        const totalWeight = PRIZES.reduce((sum, prize) => sum + prize.weight, 0);
        let randomNum = Math.floor(Math.random() * totalWeight);

        let winningIndex = 0;
        for (let i = 0; i < PRIZES.length; i++) {
            if (randomNum < PRIZES[i].weight) {
                winningIndex = i;
                break;
            }
            randomNum -= PRIZES[i].weight;
        }

        const wonPrize = PRIZES[winningIndex];

        user.hasSpun = true;
        user.wonRewardLabel = wonPrize.label;
        user.activeReward = {
            label: wonPrize.label,
            discountType: wonPrize.discountType,
            discountValue: wonPrize.discountValue,
            wonAt: new Date(),
        };
        await user.save();

        return NextResponse.json({
            success: true,
            winningIndex,
            reward: {
                label: wonPrize.label,
                discountType: wonPrize.discountType,
                discountValue: wonPrize.discountValue,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
