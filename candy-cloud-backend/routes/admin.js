const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getAdminOrders,
    getAdminInventory,
    createProduct,
    updateProduct,
    getAdminCustomers,
    getAdminCustomerDetails,
    getAdminGoldenScoop
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

// All admin routes are protected by both user and admin middleware
router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardStats);
router.get("/orders", getAdminOrders);
router.get("/inventory", getAdminInventory);
router.post("/inventory", createProduct);
router.put("/inventory/:id", updateProduct);
router.get("/customers", getAdminCustomers);
router.get("/customers/:id", getAdminCustomerDetails);
router.get("/golden-scoop", getAdminGoldenScoop);

module.exports = router;


