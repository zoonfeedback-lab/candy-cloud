const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: String,
    },
    name: String,
    emoji: String,
    price: Number,
    quantity: Number,
    description: String,
}, { _id: false });

const trackingEventSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
        required: true,
    },
    message: {
        type: String,
        default: "",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderNumber: {
        type: String,
        unique: true,
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true,
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    discountAmt: {
        type: Number,
        default: 0,
    },
    couponCode: {
        type: String,
        default: null,
    },
    total: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        firstName: String,
        lastName: String,
        street: String,
        city: String,
        zip: String,
        phone: String,
    },
    shippingMethod: {
        type: String,
        enum: ["express", "standard"],
        default: "standard",
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "stripe", "jazzcash", "easypaisa"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
        default: "placed",
    },
    trackingHistory: [trackingEventSchema],
    estimatedDelivery: Date,
    stripePaymentIntentId: String,
    transactionId: String,
}, {
    timestamps: true,
});

// Auto-generate order number before saving
orderSchema.pre("save", async function () {
    if (!this.orderNumber) {
        const count = await mongoose.model("Order").countDocuments();
        this.orderNumber = `CC-${String(count + 1).padStart(5, "0")}`;
    }
});

// Add initial tracking event on creation
orderSchema.pre("save", function () {
    if (this.isNew && this.trackingHistory.length === 0) {
        this.trackingHistory.push({
            status: "placed",
            message: "Order has been placed successfully",
            timestamp: new Date(),
        });
    }
});

// Index for user order history + tracking lookups
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
