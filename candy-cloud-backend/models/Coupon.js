const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Code is required"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed", "item"],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true, // e.g. 10 for 10%, or 0 for free item
    },
    description: {
        type: String, // e.g. "Free Mystery Item", "10% OFF"
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
});

// Automatically index to expire documents (if we want auto-cleanup)
// Or just validation. We'll rely on validation in the controller.

module.exports = mongoose.model("Coupon", couponSchema);
