const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingController");
const { protect, admin } = require("../middleware/auth");

router.get("/", getSettings);
router.post("/", protect, admin, updateSettings);

module.exports = router;
