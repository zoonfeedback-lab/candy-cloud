const express = require("express");
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrder,
    trackOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

// Public route — track by order number (no login needed)
router.get("/track/:orderNumber", trackOrder);

// Protected routes (require login)
router.use(protect);

router.post("/", createOrder);
router.get("/", getMyOrders);

// Admin routes
router.get("/admin/all", admin, getAllOrders);

// Single order routes
router.get("/:id", getOrder);
router.put("/:id/status", admin, updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

module.exports = router;
