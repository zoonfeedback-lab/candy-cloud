import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { handleError } from "@/lib/apiError";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { id } = await params;
        const body = await request.json();
        const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return handleError(error);
    }
}
