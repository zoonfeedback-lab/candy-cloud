import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import { handleError } from "@/lib/apiError";
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
        const { email, password, isAdmin } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Please provide email and password" }, { status: 400 });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        if (isAdmin) {
            if (user.role !== "admin") {
                return NextResponse.json({ success: false, message: "Access Denied. Only administrators can access this portal." }, { status: 403 });
            }
        } else {
            if (user.role === "admin") {
                return NextResponse.json({ success: false, message: "Administrators must login through the Admin Portal." }, { status: 403 });
            }
        }

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
        });

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
