"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Category display config
const CATEGORY_CONFIG = {
    "sweet-treat": { label: "Sweet Treat", emoji: "🍬", color: "from-pink to-pink-dark", bgLight: "bg-pink-50", borderColor: "border-pink-200" },
    "dreamy-delight": { label: "Dreamy Delight", emoji: "✨", color: "from-purple-400 to-pink", bgLight: "bg-purple-50", borderColor: "border-purple-200" },
    "cloud-nine": { label: "Cloud Nine", emoji: "☁️", color: "from-sky-400 to-teal", bgLight: "bg-sky-50", borderColor: "border-sky-200" },
    "bundle": { label: "Bundles", emoji: "🎁", color: "from-amber-400 to-orange-400", bgLight: "bg-amber-50", borderColor: "border-amber-200" },
    "special-deal": { label: "Special Deals", emoji: "⭐", color: "from-yellow-400 to-orange-400", bgLight: "bg-yellow-50", borderColor: "border-yellow-200" },
};

const ALL_KEY = "All 🌟";

export default function ShopByCategory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(ALL_KEY);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Build category tabs from actual data
    const categoryKeys = [...new Set(products.map(p => p.category))];
    const mainCategories = categoryKeys.filter(c => CATEGORY_CONFIG[c]);
    const tabs = [ALL_KEY, ...mainCategories.map(c => CATEGORY_CONFIG[c]?.label || c)];

    // Map label back to category key
    const labelToKey = {};
    mainCategories.forEach(c => { labelToKey[CATEGORY_CONFIG[c]?.label || c] = c; });

    // Filter products by active tab
    const activeCategoryKey = activeTab === ALL_KEY ? null : labelToKey[activeTab];
    const filteredByCategory = activeCategoryKey
        ? products.filter(p => p.category === activeCategoryKey)
        : products.filter(p => p.category !== "bundle" && p.category !== "special-deal");

    // Filter by search
    const filteredItems = searchQuery.trim()
        ? filteredByCategory.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : filteredByCategory;

    // Get config for current category
    const currentConfig = activeCategoryKey
        ? CATEGORY_CONFIG[activeCategoryKey]
        : { label: "All 🌟", emoji: "🌟", color: "from-pink-400 to-purple-500", bgLight: "bg-pink-50" };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 inline-block">Shop 🍭</h2>
                        <p className="text-lg text-gray-500 max-w-[600px] mx-auto font-medium">Loading magic...</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-[20px] p-5 h-36 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="categories" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 inline-block">
                        Shop 🍭
                    </h2>
                    <p className="text-lg text-gray-500 max-w-[600px] mx-auto font-medium">
                        Explore our curated collections — there&apos;s something magical for everyone!
                    </p>
                </div>

                {/* Active Category Container */}
                <div className={`relative rounded-[30px] p-8 md:p-12 transition-all duration-500 shadow-sm border border-white/50 bg-gradient-to-b ${activeTab === ALL_KEY ? 'from-[#f3efff] to-[#ffeaf5]' : 'from-[#ffe3ef] to-[#ffd3e6]'} overflow-hidden`}>

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-10 left-10 text-3xl animate-bounce opacity-70 blur-[1px]">☁️</div>
                    <div className="absolute top-20 right-20 text-2xl animate-pulse2 opacity-80">⭐</div>
                    <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce delay-1000 opacity-60">🍬</div>
                    <div className="absolute top-1/2 right-10 text-xl animate-pulse opacity-90 blur-[1px]">✨</div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-sm">
                                    <span className="text-3xl">{currentConfig.emoji}</span>
                                </div>
                                <h3 className="text-3xl font-extrabold text-gray-800">{activeTab}</h3>
                            </div>
                            <span className="px-4 py-1.5 bg-white/70 rounded-full text-sm font-bold text-pink-600 shadow-sm backdrop-blur-sm">
                                {filteredItems.length} {searchQuery ? 'found' : 'magical items'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                            {filteredItems.length > 0 ? filteredItems.map((product) => {
                                const slug = product.name.toLowerCase().replace(/\s+/g, '-');
                                const config = CATEGORY_CONFIG[product.category] || { bgLight: "bg-gray-50", emoji: "🎀" };
                                return (
                                    <Link
                                        href={`/shop/${slug}`}
                                        key={product._id}
                                        className={`
                                            bg-white rounded-[20px] p-5 text-center transition-all duration-200 cursor-pointer group relative
                                            shadow-[0_6px_18px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_25px_rgba(236,72,153,0.15)] hover:-translate-y-[6px]
                                        `}
                                    >
                                        {/* Tooltip for category context on All tab */}
                                        {activeTab === ALL_KEY && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
                                                {config.label} {config.emoji}
                                            </div>
                                        )}
                                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${config.bgLight}`}>
                                            <span className="text-[32px]">
                                                {product.emoji || "🎀"}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-pink-600 transition-colors">
                                            {product.name}
                                        </span>
                                        <p className="text-xs text-pink-500 font-bold mt-1">Rs {product.price}</p>
                                    </Link>
                                );
                            }) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-4xl mb-3 opacity-60">🔍</div>
                                    <p className="text-gray-500 font-medium">No items found for &quot;{searchQuery}&quot; in {activeTab}</p>
                                    <p className="text-xs text-gray-400 mt-1">Try a different category or clear the search</p>
                                </div>
                            )}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-[30px] bg-gradient-to-r from-[#ff6fae] to-[#ff3c8e] text-white font-bold text-base hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,60,142,0.4)] transition-all duration-300"
                            >
                                {activeTab === ALL_KEY ? "Shop The Full Candy Cloud Collection ✨" : `Shop ${activeTab} Collection →`}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
