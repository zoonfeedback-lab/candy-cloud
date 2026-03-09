const express = require("express");
const router = express.Router();
const {
    register,
    requestOTP,
    login,
    refreshToken,
    getMe,
    logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register/otp", requestOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
