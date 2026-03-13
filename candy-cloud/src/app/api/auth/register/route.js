import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";
import OTP from "@/models/OTP";

function generateTokens(id) {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "15m",
    });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
    });
    return { accessToken, refreshToken };
}

export async function POST(request) {
    try {
        await connectDB();
        const { name, email, password, phone, otp } = await request.json();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "Registration is currently limited to valid @gmail.com addresses only." },
                { status: 400 }
            );
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
        }

        if (!otp) {
            return NextResponse.json({ success: false, message: "Please provide the verification code" }, { status: 400 });
        }

        const validOTPRecord = await OTP.findOne({ email });
        if (!validOTPRecord) {
            return NextResponse.json({ success: false, message: "Verification code has expired. Please request a new one." }, { status: 400 });
        }

        if (validOTPRecord.otp !== otp) {
            return NextResponse.json({ success: false, message: "Invalid verification code." }, { status: 400 });
        }

        const user = await User.create({ name, email, password, phone });
        await OTP.deleteOne({ _id: validOTPRecord._id });

        const { accessToken, refreshToken } = generateTokens(user._id);

        const response = NextResponse.json({
            success: true,
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hasSpun: user.hasSpun,
            },
        }, { status: 201 });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        return handleError(error);
    }
}
