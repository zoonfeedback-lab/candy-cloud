const express = require("express");
const router = express.Router();
const { spinWheel, getActiveReward, redeemReward } = require("../controllers/rewardController");
const { protect } = require("../middleware/auth");

router.post("/spin", protect, spinWheel);
router.get("/active", protect, getActiveReward);
router.post("/redeem", protect, redeemReward);

module.exports = router;
