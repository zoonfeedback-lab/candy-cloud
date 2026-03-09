const express = require("express");
const router = express.Router();
const { spinWheel, applyCoupon } = require("../controllers/rewardController");
const { protect } = require("../middleware/auth");

router.post("/spin", protect, spinWheel);
router.post("/apply-coupon", protect, applyCoupon);

module.exports = router;
