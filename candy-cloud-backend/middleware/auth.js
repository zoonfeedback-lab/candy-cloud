const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401);
        return next(new Error("Not authorized, no token"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.status(401);
            return next(new Error("Not authorized, user not found"));
        }

        next();
    } catch (error) {
        res.status(401);
        return next(new Error("Not authorized, token failed"));
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        next(new Error("Not authorized as an admin"));
    }
};

module.exports = { protect, admin };
