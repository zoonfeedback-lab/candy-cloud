const Cart = require("../models/Cart");

// @desc    Get user's cart
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, name, emoji, price, quantity = 1, description } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Check if item already exists
        const existingItem = cart.items.find(
            (item) => item.product === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                name,
                emoji,
                price,
                quantity,
                description,
            });
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Update item quantity
// @route   PUT /api/cart/:itemId
exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.status(404);
            return next(new Error("Cart not found"));
        }

        const itemIndex = cart.items.findIndex(i => i.product === req.params.itemId);
        if (itemIndex === -1) {
            res.status(404);
            return next(new Error("Item not found in cart"));
        }

        if (quantity < 1) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
exports.removeCartItem = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            res.status(404);
            return next(new Error("Cart not found"));
        }

        const itemIndex = cart.items.findIndex(i => i.product === req.params.itemId);
        if (itemIndex === -1) {
            res.status(404);
            return next(new Error("Item not found in cart"));
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        next(error);
    }
};
