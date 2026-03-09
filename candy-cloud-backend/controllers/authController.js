const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const sendOTP = require("../utils/sendEmail");

// Generate JWT tokens
const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "15m",
    });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
    });
    return { accessToken, refreshToken };
};

// @desc    Request OTP Code for Registration
// @route   POST /api/auth/register/otp
exports.requestOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        // 1. Strict @gmail.com validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!emailRegex.test(email)) {
            res.status(400);
            return next(new Error("Registration is currently limited to valid @gmail.com addresses only."));
        }

        // 2. Ensure User doesn't already exist
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            return next(new Error("User already exists"));
        }

        // 3. Generate 6-digit numerical OTP
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

        // 4. Overwrite any existing unexpired OTPs for this email in the database
        await OTP.deleteMany({ email });
        await OTP.create({ email, otp: generatedOTP });

        // 5. Send via Nodemailer
        await sendOTP(email, generatedOTP);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP and Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, otp } = req.body;

        // Check if email is a valid gmail address
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!emailRegex.test(email)) {
            res.status(400);
            return next(new Error("Registration is currently limited to valid @gmail.com addresses only."));
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            return next(new Error("User already exists"));
        }

        // Ensure OTP was provided
        if (!otp) {
            res.status(400);
            return next(new Error("Please provide the verification code"));
        }

        // Find the valid OTP record for this email
        const validOTPRecord = await OTP.findOne({ email });
        if (!validOTPRecord) {
            res.status(400);
            return next(new Error("Verification code has expired. Please request a new one."));
        }

        if (validOTPRecord.otp !== otp) {
            res.status(400);
            return next(new Error("Invalid verification code."));
        }

        const user = await User.create({ name, email, password, phone });

        // Cleanup the OTP document now that it's successfully consumed
        await OTP.deleteOne({ _id: validOTPRecord._id });

        const { accessToken, refreshToken } = generateTokens(user._id);

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            return next(new Error("Please provide email and password"));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            res.status(401);
            return next(new Error("Invalid email or password"));
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            res.status(401);
            return next(new Error("No refresh token"));
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401);
            return next(new Error("Invalid refresh token"));
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, token: accessToken });
    } catch (error) {
        res.status(401);
        next(new Error("Invalid refresh token"));
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout (clear refresh token)
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ success: true, message: "Logged out" });
};
