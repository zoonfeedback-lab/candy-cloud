import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";
import OTP from "@/models/OTP";
import sendOTP from "@/lib/sendEmail";

export async function POST(request) {
    try {
        await connectDB();
        const { email } = await request.json();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "Registration is currently limited to valid @gmail.com addresses only." },
                { status: 400 }
            );
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 400 }
            );
        }

        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteMany({ email });
        await OTP.create({ email, otp: generatedOTP });

        await sendOTP(email, generatedOTP);

        return NextResponse.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        return handleError(error);
    }
}
