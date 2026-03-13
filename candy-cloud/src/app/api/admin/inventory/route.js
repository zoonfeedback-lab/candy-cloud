import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import Product from "@/models/Product";

export async function GET(request) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const stockStatus = searchParams.get("stockStatus") || "";

        const query = {};
        if (category && category !== "all") query.category = category;
        if (stockStatus && stockStatus !== "all") {
            if (stockStatus === "in_stock") query.stock = { $gt: 20 };
            else if (stockStatus === "low_stock") query.stock = { $gt: 0, $lte: 20 };
            else if (stockStatus === "out_of_stock") query.stock = 0;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const totalItemsFiltered = await Product.countDocuments(query);
        const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

        const formattedProducts = products.map((product) => {
            const shortCat = product.category ? product.category.split(" ").map((w) => w[0]).join("").toUpperCase() : "CC";
            const sku = `SKU-${shortCat}-${product._id.toString().substring(product._id.toString().length - 3)}`;

            let stockLevelStatus = "in_stock";
            if (product.stock === 0) stockLevelStatus = "out_of_stock";
            else if (product.stock <= 20) stockLevelStatus = "low_stock";

            return {
                id: product._id,
                name: product.name,
                category: product.category || "Uncategorized",
                emoji: product.emoji || "🎁",
                description: product.description || "",
                items: product.items || "",
                sku,
                price: product.price,
                stock: product.stock,
                isFeatured: product.isFeatured || false,
                stockStatus: stockLevelStatus,
            };
        });

        // KPIs
        const sweetTreats = await Product.find({ category: "Sweet Treat Box" }).select("stock");
        const stTotalStock = sweetTreats.reduce((sum, item) => sum + item.stock, 0);
        const stStatus = stTotalStock === 0 ? "Out of Stock" : stTotalStock < 30 ? "Low Stock" : "Healthy";

        const dreamyDelight = await Product.find({ category: "Dreamy Delight Box" }).select("stock");
        const ddTotalStock = dreamyDelight.reduce((sum, item) => sum + item.stock, 0);
        const ddStatus = ddTotalStock === 0 ? "Out of Stock" : ddTotalStock < 30 ? "Low Stock" : "Healthy";

        const cloudNine = await Product.find({ category: "Cloud Nine Box" }).select("stock");
        const cnTotalStock = cloudNine.reduce((sum, item) => sum + item.stock, 0);
        const cnStatus = cnTotalStock === 0 ? "Out of Stock" : cnTotalStock < 30 ? "Low Stock" : "Healthy";

        return NextResponse.json({
            success: true,
            kpis: {
                sweetTreat: { items: sweetTreats.length, status: stStatus },
                dreamyDelight: { items: dreamyDelight.length, status: ddStatus },
                cloudNine: { items: cloudNine.length, status: cnStatus },
            },
            pagination: { currentPage: page, totalPages: Math.ceil(totalItemsFiltered / limit), totalItems: totalItemsFiltered },
            inventory: formattedProducts,
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { name, price, category, emoji, description, items, stock, isFeatured } = await request.json();

        if (!name || price === undefined || !category) {
            return NextResponse.json({ success: false, message: "Name, price, and category are required" }, { status: 400 });
        }

        const product = await Product.create({
            name, price, category, emoji: emoji || "🎁",
            description: description || "", items: items || "",
            stock: stock !== undefined ? stock : 100, isFeatured: isFeatured || false,
        });

        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
