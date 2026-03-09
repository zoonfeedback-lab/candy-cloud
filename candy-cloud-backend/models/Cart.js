const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    name: String,
    emoji: String,
    price: Number,
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
    description: String,
}, { _id: true });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // One cart per user
    },
    items: [cartItemSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Cart", cartSchema);
