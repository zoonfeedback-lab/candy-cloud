import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Product from "@/models/Product";

export async function PUT(request, { params }) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { id } = await params;
        const body = await request.json();

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const allowedFields = ["name", "price", "category", "emoji", "description", "items", "stock", "isFeatured", "isActive"];
        allowedFields.forEach((field) => {
            if (body[field] !== undefined) {
                product[field] = body[field];
            }
        });

        await product.save();
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return handleError(error);
    }
}
