import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Setting from "@/models/Setting";

export async function GET() {
    try {
        await connectDB();
        const settings = await Setting.find();
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json({ success: true, data: settingsObj });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        await requireAdmin(request);
        const settings = await request.json();

        const updatePromises = Object.entries(settings).map(([key, value]) => {
            return Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
        });

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
        return handleError(error);
    }
}
