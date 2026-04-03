"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const SHOP_CATEGORIES = [
    {
        id: "mystery-bags",
        subtitle: "The Ultimate Jewelry Haul",
        title: "Mystery Bags",
        href: "/shop/mystery-bags",
        bg: "bg-[#e2d5ff]",
        decorBg: "bg-[#d3bfff]/60",
        emoji: "🛍️",
        comingSoon: true,
    },
    {
        id: "makeup-scoop",
        subtitle: "Glow-Up with A Single Dip",
        title: "Makeup Scoop",
        href: "/shop/makeup-scoop",
        bg: "bg-[#e2d5ff]",
        decorBg: "bg-[#d3bfff]/60",
        emoji: "💄",
        comingSoon: true,
    },
    {
        id: "stationary-balls",
        subtitle: "Tiny Capsule Of Magic",
        title: "Stationary Balls",
        href: "/shop/stationary-balls",
        bg: "bg-[#e2d5ff]",
        decorBg: "bg-[#d3bfff]/60",
        emoji: "🎾",
        comingSoon: true,
    },
    {
        id: "mystery-jar",
        subtitle: "Candy-Coated Wonderland",
        title: "Mystery Jar",
        href: "/shop/mystery-jar",
        bg: "bg-[#e2d5ff]",
        decorBg: "bg-[#d3bfff]/60",
        emoji: "🫙",
        comingSoon: true,
    },
];

export default function ShopByCategory() {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated, openAuthModal } = useAuth();

    const handleWishlistToggle = (e, cat) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }
        toggleWishlist({
            productId: cat.id,
            name: cat.title,
            emoji: cat.emoji,
            type: "category",
            description: cat.subtitle,
        });
    };

    return (
        <section id="categories" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="text-center mb-10 text-[#2a2a2a]">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-3 inline-block">
                        SHOP
                    </h2>
                    <p className="text-2xl mx-auto font-medium">
                        Shop Contains
                    </p>
                </div>

                {/* Active Category Container */}
                <div className="relative rounded-[30px] p-8 md:p-12 transition-all duration-500 bg-gradient-to-b from-[#fbf8ff] to-[#f4ecff] overflow-hidden">
                    
                    {/* Header */}
                    <div className="relative z-10 mb-8 inline-block">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-2xl">🌟</span>
                            <h3 className="text-xl font-bold text-gray-800">All</h3>
                            <span className="text-yellow-400 text-2xl">🌟</span>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px]">
                        {SHOP_CATEGORIES.map((cat, i) => (
                            <Link
                                href={cat.href}
                                key={i}
                                className={`
                                    relative ${cat.bg} rounded-2xl p-8 overflow-hidden
                                    border-2 border-dashed border-[#d3bfff]
                                    ${cat.comingSoon ? "pointer-events-none opacity-90 grayscale-[0.2]" : "hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer block group"}
                                `}
                            >
                                {/* Decorative Blobs similar to Customize deal */}
                                <div className={`absolute -bottom-6 -left-6 w-32 h-32 ${cat.decorBg} rounded-[55%_45%_50%_50%/45%_55%_50%_50%] opacity-70 transition-transform duration-500 group-hover:scale-110`} />
                                <div className={`absolute -top-4 -right-4 w-28 h-28 ${cat.decorBg} rounded-[55%_45%_50%_50%/45%_55%_50%_50%] opacity-50 transition-transform duration-500 group-hover:scale-110`} />
                                <div className="absolute bottom-0 right-16 w-20 h-10 border-2 border-white/50 rounded-t-full opacity-60" />
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-semibold tracking-wider text-pink-dark uppercase">
                                            {cat.subtitle}
                                        </p>
                                        {!cat.comingSoon && (
                                            <button 
                                                onClick={(e) => handleWishlistToggle(e, cat)}
                                                className={`p-2 rounded-full transition-all hover:scale-110 active:scale-90 ${isInWishlist(cat.id) ? "bg-white text-pink shadow-md" : "bg-white/50 text-gray-400 hover:bg-white hover:text-pink"}`}
                                            >
                                                <svg className="w-5 h-5" fill={isInWishlist(cat.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-2xl md:text-3xl font-extrabold text-[#111] leading-tight whitespace-pre-line">
                                            {cat.title}
                                        </h3>
                                        {!cat.comingSoon && (
                                            <span className="text-4xl text-[#ff6fae] font-bold group-hover:translate-x-2 transition-transform duration-300">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                    <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#111] text-white text-sm font-semibold group-hover:bg-gray-800 transition-colors opacity-0 h-0 overflow-hidden" aria-hidden="true">
                                        Hidden Button
                                    </span>
                                </div>

                                {cat.comingSoon && (
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center p-4">
                                        <div className="bg-white/90 px-6 py-3 rounded-2xl shadow-xl border-2 border-[#d3bfff] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                            <span className="text-xl md:text-2xl font-black text-[#111] tracking-tight uppercase">COMING SOON</span>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
