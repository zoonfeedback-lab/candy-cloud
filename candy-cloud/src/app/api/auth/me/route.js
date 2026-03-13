import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";

export async function GET(request) {
    try {
        await connectDB();
        const authUser = await requireAuth(request);
        const user = await User.findById(authUser._id);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                hasSpun: user.hasSpun,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
