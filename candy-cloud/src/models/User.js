import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    phone: {
        type: String,
        default: "",
    },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        zip: { type: String, default: "" },
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
    hasSpun: {
        type: Boolean,
        default: false,
    },
    wonRewardLabel: {
        type: String,
        default: null,
    },
    activeReward: {
        label: { type: String, default: null },
        discountType: { type: String, enum: ["percentage", "fixed", "item", null], default: null },
        discountValue: { type: Number, default: 0 },
        wonAt: { type: Date, default: null },
    },
}, {
    timestamps: true,
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (typeof enteredPassword !== "string" || typeof this.password !== "string") {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
