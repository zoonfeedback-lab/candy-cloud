const express = require("express");
const router = express.Router();
const { createStripeIntent, initiateJazzCash, jazzcashCallback, initiateEasyPaisa, easypaisaCallback } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.post("/stripe/create-intent", protect, createStripeIntent);
router.post("/jazzcash/initiate", protect, initiateJazzCash);
router.post("/jazzcash/callback", jazzcashCallback);
router.post("/easypaisa/initiate", protect, initiateEasyPaisa);
router.post("/easypaisa/callback", easypaisaCallback);

module.exports = router;
