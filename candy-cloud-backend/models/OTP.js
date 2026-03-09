const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please add an email"],
        match: [
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/i,
            "Please use a valid @gmail.com address"
        ],
    },
    otp: {
        type: String,
        required: [true, "Please add the OTP code"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Automatically deletes the document after 5 minutes (300 seconds)
    }
});

module.exports = mongoose.model("OTP", OTPSchema);
