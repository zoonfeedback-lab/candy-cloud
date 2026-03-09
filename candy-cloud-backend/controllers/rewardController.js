const Coupon = require("../models/Coupon");
const User = require("../models/User");
const crypto = require("crypto");

const PRIZES = [
    { label: "Mystery Item 3", discountType: "item", discountValue: 0, weight: 10 },    // Index 0
    { label: "10% OFF", discountType: "percentage", discountValue: 10, weight: 30 },   // Index 1
    { label: "Mystery Item 1", discountType: "item", discountValue: 0, weight: 10 },    // Index 2
    { label: "Free Shipping", discountType: "fixed", discountValue: 500, weight: 20 },  // Index 3 (assuming 500 = free shipping)
    { label: "Mystery Item 2", discountType: "item", discountValue: 0, weight: 10 },    // Index 4
    { label: "Free Sticker", discountType: "item", discountValue: 0, weight: 20 },      // Index 5
];

// Helper to generate a random code
const generatePromoCode = () => {
    return 'LUCKY-' + crypto.randomBytes(3).toString("hex").toUpperCase();
};

// @desc    Spin the wheel and get a reward
// @route   POST /api/rewards/spin
// @access  Private
exports.spinWheel = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check cooldown (24 hours)
        const now = new Date();
        if (user.lastSpunAt) {
            const timeDiff = now.getTime() - new Date(user.lastSpunAt).getTime();
            const hoursDiff = timeDiff / (1000 * 3600);
            if (hoursDiff < 24) {
                return res.status(403).json({
                    success: false,
                    message: `You can only spin once every 24 hours. Check back later!`,
                    nextSpinAvailable: new Date(new Date(user.lastSpunAt).getTime() + 24 * 60 * 60 * 1000)
                });
            }
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
        const couponCode = generatePromoCode();

        // Save Coupon
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

        const coupon = await Coupon.create({
            code: couponCode,
            user: userId,
            discountType: wonPrize.discountType,
            discountValue: wonPrize.discountValue,
            description: wonPrize.label,
            expiresAt
        });

        // Update User lastSpunAt
        user.lastSpunAt = now;
        await user.save();

        res.status(200).json({
            success: true,
            winningIndex,
            coupon: {
                code: coupon.code,
                label: wonPrize.label,
                expiresAt: coupon.expiresAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply a promo code
// @route   POST /api/rewards/apply-coupon
// @access  Private
exports.applyCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        if (!code) {
            return res.status(400).json({ success: false, message: "Please provide a coupon code" });
        }

        // Find the coupon
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            user: userId
        });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid or unauthorized coupon code" });
        }

        if (coupon.isUsed) {
            return res.status(400).json({ success: false, message: "This coupon has already been used" });
        }

        if (new Date(coupon.expiresAt) < new Date()) {
            return res.status(400).json({ success: false, message: "This coupon has expired" });
        }

        res.status(200).json({
            success: true,
            coupon: {
                id: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                description: coupon.description
            }
        });
    } catch (error) {
        next(error);
    }
};
