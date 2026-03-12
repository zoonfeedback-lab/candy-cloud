const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api/auth", limiter);

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

// Stripe Webhook must be parsed before global express.json
app.post("/api/payments/stripe/webhook", express.raw({ type: "application/json" }), require("./controllers/paymentController").stripeWebhook);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/rewards", require("./routes/rewards"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/settings", require("./routes/settingRoutes"));

// Health check
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "🍬 Candy Cloud API is running!", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🍬 Candy Cloud API Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
