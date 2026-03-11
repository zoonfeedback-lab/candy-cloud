"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORY_CONFIG = {
    "sweet-treat": { label: "Sweet Treat", emoji: "🍬", color: "from-pink to-pink-dark" },
    "dreamy-delight": { label: "Dreamy Delight", emoji: "✨", color: "from-purple-400 to-pink" },
    "cloud-nine": { label: "Cloud Nine", emoji: "☁️", color: "from-sky-400 to-teal" },
    "bundle": { label: "Bundle", emoji: "🎁", color: "from-amber-400 to-orange-400" },
    "special-deal": { label: "Special Deal", emoji: "⭐", color: "from-yellow-400 to-orange-400" },
};

const ITEM_COLORS = [
    { id: "pink", name: "Pink Splash", color: "bg-pink-400", ring: "ring-pink-200" },
    { id: "blue", name: "Ocean Blue", color: "bg-blue-400", ring: "ring-blue-200" },
    { id: "purple", name: "Lilac Dream", color: "bg-purple-400", ring: "ring-purple-200" },
    { id: "mystery", name: "Surprise Me", color: "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400", ring: "ring-gray-200" },
];

export default function ItemDetail() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { isAuthenticated, openAuthModal } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(ITEM_COLORS[0]);
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.slug) return;

            try {
                // Fetch all products and find by slug match
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();

                if (data.success) {
                    const slugName = params.slug.toLowerCase().replace(/-/g, " ");
                    const found = data.products.find(
                        p => p.name.toLowerCase() === slugName
                    );

                    if (found) {
                        setProduct(found);
                    } else {
                        router.push('/shop');
                    }
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.slug, router]);

    if (loading || !product) {
        return <div className="min-h-screen flex items-center justify-center text-pink-500 font-bold animate-pulse">Loading Magic... ✨</div>;
    }

    const config = CATEGORY_CONFIG[product.category] || { label: product.category, emoji: "🎀", color: "from-pink-400 to-purple-400" };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }

        const itemToCart = {
            id: product._id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            type: "Shop Item",
            description: product.description || `From ${config.label} collection`
        };

        addToCart(itemToCart, quantity);

        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2500);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-5 py-24">

                {/* Back Link */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors font-medium mb-8">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Shop
                </Link>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Left Column - Visual Representation */}
                    <div className="w-full lg:w-1/2">
                        <div className={`
                            w-full aspect-square rounded-[40px] flex items-center justify-center relative overflow-hidden
                            bg-gradient-to-br ${config.color} p-1
                        `}>
                            {/* Inner Card */}
                            <div className="absolute inset-[4px] bg-white/90 backdrop-blur-xl rounded-[36px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
                                {/* Ambient Background Glow */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full opacity-20 blur-3xl transition-colors duration-500 ${selectedColor.color}`} style={{ zIndex: 0 }}></div>

                                <span className="text-[120px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] animate-bounce relative z-10" style={{ animationDuration: '3s' }}>
                                    {product.emoji}
                                </span>
                                <h2 className="text-4xl font-extrabold text-gray-800 mt-6 relative z-10">{product.name}</h2>
                                <p className="text-pink-500 font-bold text-lg mt-2 relative z-10">{config.label}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Configuration & Cart */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-2xl font-bold text-pink-500 mb-4">Rs {product.price}</p>

                        {product.description && (
                            <p className="text-gray-500 font-medium mb-8">{product.description}</p>
                        )}

                        <div className="space-y-8">
                            {/* Color Selector */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Select Color</h3>
                                <div className="flex flex-wrap gap-4">
                                    {ITEM_COLORS.map(color => {
                                        const isSelected = selectedColor.id === color.id;
                                        return (
                                            <button
                                                key={color.id}
                                                onClick={() => setSelectedColor(color)}
                                                className={`
                                                    group relative flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-300
                                                    ${isSelected ? 'border-pink-500 bg-pink-50 ring-4 ring-pink-100' : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-gray-50'}
                                                `}
                                            >
                                                <div className={`w-5 h-5 rounded-full ${color.color} shadow-inner`}></div>
                                                <span className={`font-bold text-sm ${isSelected ? 'text-pink-700' : 'text-gray-600'}`}>
                                                    {color.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="pt-8 border-t border-gray-200">
                                <div className="flex gap-4">
                                    {/* Qty Counter */}
                                    <div className="flex items-center justify-between bg-white border-2 border-gray-200 rounded-2xl px-2 w-[140px] shrink-0">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors font-bold text-xl"
                                        >-</button>
                                        <span className="font-bold text-lg text-gray-800 w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock || 50, quantity + 1))}
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors font-bold text-xl"
                                        >+</button>
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className={`
                                            flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2
                                            ${product.stock === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : addedToast
                                                    ? 'bg-green-500 text-white shadow-[0_8px_25px_rgba(34,197,94,0.4)] scale-[0.98]'
                                                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_8px_25px_rgba(236,72,153,0.4)] hover:scale-[1.02]'}
                                        `}
                                    >
                                        {addedToast ? (
                                            <>
                                                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                Added to Cart!
                                            </>
                                        ) : product.stock === 0 ? (
                                            "Out of Stock"
                                        ) : (
                                            <>
                                                Add to Cart • Rs {product.price * quantity}
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-400 text-sm text-center mt-4 flex items-center justify-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Item requires authentication to add to cart
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
