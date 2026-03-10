const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

// All admin routes must be protected and restricted to admin role
router.use(protect, admin);

router.get("/dashboard", getDashboardStats);

module.exports = router;
