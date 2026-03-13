import mongoose from "mongoose";

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
        required: true,
    },
    description: {
        type: String,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
