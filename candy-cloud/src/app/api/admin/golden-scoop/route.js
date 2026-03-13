import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(request) {
    try {
        await connectDB();
        await requireAdmin(request);

        const winners = await User.find({ hasSpun: true })
            .select("name email createdAt activeReward wonRewardLabel")
            .sort({ createdAt: -1 })
            .lean();

        const formattedWinners = [];
        for (const user of winners) {
            const order = await Order.findOne({ user: user._id, discount: { $gt: 0 } }).lean()
                || await Order.findOne({ user: user._id }).sort({ createdAt: -1 }).lean();

            let rewardStr = "Reward Pending";
            if (user.wonRewardLabel) rewardStr = user.wonRewardLabel;
            else if (user.activeReward && user.activeReward.label) rewardStr = user.activeReward.label;
            else if (order && order.discount > 0) rewardStr = `Rs ${order.discount} OFF`;

            formattedWinners.push({
                id: user._id.toString().substring(user._id.toString().length - 4),
                date: order ? order.createdAt : user.createdAt,
                customerName: user.name,
                orderId: order ? `#ORD-${order.orderNumber.slice(-4).toUpperCase()}` : "N/A",
                reward: rewardStr,
            });
        }

        const totalScoopsAssigned = 60;
        const scoopsRemaining = Math.max(0, totalScoopsAssigned - winners.length);
        const winProbability = 2.0;

        const totalJackpotGiven = await Order.aggregate([
            { $match: { discount: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$discount" } } },
        ]);
        const currentJackpot = totalJackpotGiven[0] ? totalJackpotGiven[0].total : 500.0;

        const campaign = {
            status: "Active",
            winProbability,
            totalScoops: totalScoopsAssigned,
            scoopsRemaining,
            currentJackpot,
        };

        const chartData = { MON: 45, TUE: 80, WED: 35, THU: 60, FRI: 55, SAT: 95, SUN: 25 };

        const totalCampaignOrders = await Order.countDocuments();

        return NextResponse.json({
            success: true,
            campaign,
            winners: formattedWinners,
            chartData,
            stats: {
                weeklyPerformance: "+12%",
                campaignOrders: totalCampaignOrders > 0 ? totalCampaignOrders : 2410,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
