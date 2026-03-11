const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");

// @desc    Create order from cart
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
    try {
        const {
            items,
            subtotal,
            shippingCost,
            discountAmt,
            couponCode,
            total,
            shippingAddress,
            shippingMethod,
            paymentMethod,
        } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            return next(new Error("No order items"));
        }

        if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
            res.status(400);
            return next(new Error("Incomplete shipping address provided"));
        }

        // Calculate estimated delivery
        const now = new Date();
        const deliveryDays = shippingMethod === "express" ? 3 : 7;
        const estimatedDelivery = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);

        const order = await Order.create({
            user: req.user._id,
            items,
            subtotal,
            shippingCost,
            discountAmt: discountAmt || 0,
            couponCode: couponCode || null,
            total,
            shippingAddress,
            shippingMethod,
            paymentMethod,
            estimatedDelivery,
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
        });

        // Mark coupon as used if one exists
        if (couponCode) {
            await Coupon.findOneAndUpdate(
                { code: couponCode.toUpperCase(), user: req.user._id },
                { isUsed: true }
            );
        }

        // Clear user's cart after order
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] }
        );

        res.status(201).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order with full tracking
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            return next(new Error("Order not found"));
        }

        // Make sure user owns this order or is admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            res.status(403);
            return next(new Error("Not authorized to view this order"));
        }

        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Track order by order number (public — no auth needed)
// @route   GET /api/orders/track/:orderNumber
exports.trackOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() });

        if (!order) {
            res.status(404);
            return next(new Error("Order not found. Please check your order number."));
        }

        res.json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                shippingMethod: order.shippingMethod,
                estimatedDelivery: order.estimatedDelivery,
                trackingHistory: order.trackingHistory,
                items: order.items,
                total: order.total,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, message } = req.body;

        const validStatuses = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            res.status(400);
            return next(new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`));
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404);
            return next(new Error("Order not found"));
        }

        // Don't allow status change on delivered/cancelled orders
        if (["delivered", "cancelled"].includes(order.orderStatus)) {
            res.status(400);
            return next(new Error(`Cannot update a ${order.orderStatus} order`));
        }

        // Default messages for each status
        const defaultMessages = {
            confirmed: "Order has been confirmed and is being prepared",
            processing: "Order is being packed with love 💖",
            shipped: "Order has been shipped! On its way to you",
            out_for_delivery: "Order is out for delivery — almost there!",
            delivered: "Order has been delivered. Enjoy your goodies! 🎉",
            cancelled: "Order has been cancelled",
        };

        // Update order status
        order.orderStatus = status;
        order.trackingHistory.push({
            status,
            message: message || defaultMessages[status] || `Status updated to ${status}`,
            timestamp: new Date(),
        });

        // Auto-update payment status for COD on delivery
        if (status === "delivered" && order.paymentMethod === "cod") {
            order.paymentStatus = "paid";
        }

        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order (customer)
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            return next(new Error("Order not found"));
        }

        // Only the owner can cancel
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(403);
            return next(new Error("Not authorized"));
        }

        // Can only cancel if placed or confirmed
        if (!["placed", "confirmed"].includes(order.orderStatus)) {
            res.status(400);
            return next(new Error(`Cannot cancel an order that is already ${order.orderStatus}`));
        }

        order.orderStatus = "cancelled";
        order.trackingHistory.push({
            status: "cancelled",
            message: req.body.reason || "Order cancelled by customer",
            timestamp: new Date(),
        });

        await order.save();

        res.json({ success: true, message: "Order cancelled", order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders/admin/all
exports.getAllOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.orderStatus = status;

        const orders = await Order.find(filter)
            .populate("user", "name email phone")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            count: orders.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            orders,
        });
    } catch (error) {
        next(error);
    }
};
