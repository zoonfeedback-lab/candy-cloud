const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0,
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        lowercase: true,
        trim: true,
    },
    emoji: {
        type: String,
        default: "🎁",
    },
    description: {
        type: String,
        default: "",
    },
    items: {
        type: String,
        default: "", // Comma-separated items list for bundles
    },
    stock: {
        type: Number,
        default: 100,
        min: 0,
    },
    images: [{
        type: String,
    }],
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Index for category filtering
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Product", productSchema);
