import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import connectDB from "@/lib/db";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        const { credential } = await request.json();

        if (!credential) {
            return NextResponse.json({ success: false, message: "No Google credential provided" }, { status: 400 });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        let isNew = false;

        if (!user) {
            user = await User.create({ name, email, authProvider: "google" });
            isNew = true;
        }

        if (user.role === "admin") {
            return NextResponse.json({ success: false, message: "Administrators must login through the Admin Portal." }, { status: 403 });
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
                authProvider: user.authProvider,
            },
        }, { status: isNew ? 201 : 200 });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error("Google Auth Error:", error);
        return NextResponse.json({ success: false, message: "Google authentication failed" }, { status: 401 });
    }
}
