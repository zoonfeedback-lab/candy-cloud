import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

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
        const token = request.cookies.get("refreshToken")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "No refresh token" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid refresh token" }, { status: 401 });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        const response = NextResponse.json({ success: true, token: accessToken });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch {
        return NextResponse.json({ success: false, message: "Invalid refresh token" }, { status: 401 });
    }
}
