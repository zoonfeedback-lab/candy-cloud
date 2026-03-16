"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CustomizePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const router = useRouter();
    const { isAuthenticated, openAuthModal } = useAuth();

    const MAX_ITEMS = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.success) {
                    // Filter out bundles and special-deal items
                    setProducts(data.products.filter(p => p.category !== "bundle" && p.category !== "special-deal"));
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleProduct = (productId) => {
        setSelected((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            }
            if (prev.length >= MAX_ITEMS) return prev;
            return [...prev, productId];
        });
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }
        if (selected.length !== MAX_ITEMS) return;

        const selectedNames = selected
            .map((id) => products.find((p) => p._id === id)?.name)
            .filter(Boolean)
            .join(", ");

        const queryParams = new URLSearchParams({
            direct: "true",
            id: "customize-cloud-deal",
            name: "Customize Cloud Deal",
            price: 3500,
            emoji: "🌈",
            qty: 1,
            note: `Selected items: ${selectedNames}`,
        }).toString();

        router.push(`/checkout?${queryParams}`);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50">
            <section className="max-w-[900px] mx-auto px-5 py-16 md:py-24">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-sm text-gray-500 mb-3">
                        Grab our best-value bundles customized by you!
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                        Customize<br />Cloud Deal
                    </h1>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 border border-green-200">
                        <span className="text-sm font-bold text-green-700">10 PRODUCTS OF YOUR CHOICE</span>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-6 md:p-10 relative overflow-hidden">
                    {/* Decorative */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-40 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-sky-100 rounded-full opacity-40 blur-2xl" />

                    <div className="relative z-10">
                        {/* Selection counter */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-bold text-gray-600">
                                Pick your favorites ✨
                            </p>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${selected.length === MAX_ITEMS ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {selected.length} / {MAX_ITEMS} selected
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className="bg-gray-100 rounded-2xl p-4 h-24 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {products.map((product) => {
                                    const isSelected = selected.includes(product._id);
                                    const isFull = selected.length >= MAX_ITEMS && !isSelected;

                                    return (
                                        <button
                                            key={product._id}
                                            onClick={() => toggleProduct(product._id)}
                                            disabled={isFull}
                                            className={`
                                                rounded-2xl p-4 text-center transition-all duration-200 relative group
                                                ${isSelected
                                                    ? 'bg-green-50 border-2 border-green-400 shadow-md scale-[1.02]'
                                                    : isFull
                                                        ? 'bg-gray-50 border-2 border-gray-100 opacity-40 cursor-not-allowed'
                                                        : 'bg-gray-50 border-2 border-transparent hover:border-green-200 hover:bg-green-50/50 hover:-translate-y-1 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            {/* Check badge */}
                                            {isSelected && (
                                                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm z-10">
                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}

                                            <div className="text-3xl mb-2 transition-transform group-hover:scale-110">
                                                {product.emoji || "🎀"}
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 leading-tight block">
                                                {product.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Price + Buy Row */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 flex-wrap gap-4">
                            <span className="text-2xl font-extrabold text-green-600">Rs 3,500</span>
                            <button
                                onClick={handleBuyNow}
                                disabled={selected.length !== MAX_ITEMS}
                                className={`
                                    px-8 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all
                                    ${selected.length === MAX_ITEMS
                                        ? 'bg-gray-900 text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                {selected.length === MAX_ITEMS ? 'BUY NOW' : `Select ${MAX_ITEMS - selected.length} more`}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
