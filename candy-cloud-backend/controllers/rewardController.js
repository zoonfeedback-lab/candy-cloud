const User = require("../models/User");

const PRIZES = [
    { label: "Mystery Item 3", discountType: "item", discountValue: 0, weight: 10 },
    { label: "10% OFF", discountType: "percentage", discountValue: 10, weight: 30 },
    { label: "Mystery Item 1", discountType: "item", discountValue: 0, weight: 10 },
    { label: "Free Shipping", discountType: "fixed", discountValue: 500, weight: 20 },
    { label: "Mystery Item 2", discountType: "item", discountValue: 0, weight: 10 },
    { label: "Free Sticker", discountType: "item", discountValue: 0, weight: 20 },
];

// @desc    Spin the wheel and get a reward (one-time only)
// @route   POST /api/rewards/spin
// @access  Private
exports.spinWheel = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // One-time spin check
        if (user.hasSpun) {
            return res.status(403).json({
                success: false,
                message: "You've already claimed your welcome reward!",
            });
        }

        // Determine Prize using weighted randomizer
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

        // Save reward directly to user account
        user.hasSpun = true;
        user.activeReward = {
            label: wonPrize.label,
            discountType: wonPrize.discountType,
            discountValue: wonPrize.discountValue,
            wonAt: new Date(),
        };
        await user.save();

        res.status(200).json({
            success: true,
            winningIndex,
            reward: {
                label: wonPrize.label,
                discountType: wonPrize.discountType,
                discountValue: wonPrize.discountValue,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's active reward
// @route   GET /api/rewards/active
// @access  Private
exports.getActiveReward = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if user has an active (unredeemed) reward
        if (!user.activeReward || !user.activeReward.label) {
            return res.status(200).json({ success: true, reward: null });
        }

        res.status(200).json({
            success: true,
            reward: {
                label: user.activeReward.label,
                discountType: user.activeReward.discountType,
                discountValue: user.activeReward.discountValue,
                wonAt: user.activeReward.wonAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Redeem the active reward (called after order is placed)
// @route   POST /api/rewards/redeem
// @access  Private
exports.redeemReward = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.activeReward || !user.activeReward.label) {
            return res.status(400).json({ success: false, message: "No active reward to redeem" });
        }

        // Clear the reward
        user.activeReward = {
            label: null,
            discountType: null,
            discountValue: 0,
            wonAt: null,
        };
        await user.save();

        res.status(200).json({ success: true, message: "Reward redeemed successfully!" });
    } catch (error) {
        next(error);
    }
};
