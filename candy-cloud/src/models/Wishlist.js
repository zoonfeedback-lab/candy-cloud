import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    name: String,
    emoji: String,
    type: {
        type: String,
        default: "product",
    },
    description: String,
}, { _id: true });

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [wishlistItemSchema],
}, {
    timestamps: true,
});

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
