import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { handleError } from "@/lib/apiError";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const filter = { isActive: true };
        const category = searchParams.get("category");
        if (category) {
            filter.category = category.toLowerCase();
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: products.length, products });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        await requireAdmin(request);
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
