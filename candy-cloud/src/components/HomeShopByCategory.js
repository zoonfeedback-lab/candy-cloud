"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const bundles = [
    {
        tag: "Only 5 left - The sugar rush is real!",
        icon: <span className="text-pink-500 text-3xl">🍬</span>,
        title: "Sweet Treat",
        rating: "4.9",
        reviews: "245",
        price: 1500,
        items: "Stickers, Washitape, Erasers, Hairties, Paper soap, Pens, Pencils, Scrunchies",
        tagColor: "bg-pink-100/50 text-pink font-medium",
        iconContainer: "h-16 w-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-2",
    },
    {
        tag: "Selling fast! - Glow like a galaxy",
        icon: <span className="text-yellow-400 text-3xl">✨</span>,
        title: "Dreamy Delight",
        rating: "4.8",
        reviews: "182",
        price: 2200,
        items: "Lip gloss, Face masks, Earrings, Mini notebooks, Sticky notes, Highlighter, Mirror, Eye mask",
        tagColor: "bg-red-50 text-red-400 font-medium",
        iconContainer: "h-16 w-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-2",
    },
    {
        tag: "Only 3 left - Pure magic in a bag!",
        icon: <span className="text-blue-500 text-3xl">☁️</span>,
        title: "Cloud Nine",
        rating: "5.0",
        reviews: "520",
        price: 4500,
        items: "Planners, Journals, Multicolor pens, Watches, Necklaces, Jewelry boxes, Mystery box, Full-sized bag",
        tagColor: "bg-pink-100/50 text-pink font-medium",
        iconContainer: "h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2",
    }
];

export default function HomeShopByCategory() {
    const { addToCart } = useCart();
    const { isAuthenticated, openAuthModal } = useAuth();
    const [addedStates, setAddedStates] = useState({});

    const handleAddToCart = (bundle) => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }
        // Transform the visual bundle into a real cart item
        const payload = {
            id: `bundle-${bundle.title.toLowerCase().replace(/\s+/g, '-')}`,
            name: `${bundle.title} Bundle Pack`,
            price: bundle.price,
            type: "Bundle Kit",
            emoji: bundle.title === "Sweet Treat" ? "🍬" : (bundle.title === "Dreamy Delight" ? "✨" : "☁️"),
        };
        addToCart(payload, 1);

        // Feedback
        setAddedStates(prev => ({ ...prev, [bundle.title]: true }));
        setTimeout(() => {
            setAddedStates(prev => ({ ...prev, [bundle.title]: false }));
        }, 1500);
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1200px] mx-auto px-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="grid grid-cols-2 gap-0.5 text-pink">
                            <div className="w-2.5 h-2.5 bg-pink rounded-sm" />
                            <div className="w-2.5 h-2.5 bg-pink rounded-sm" />
                            <div className="w-2.5 h-2.5 bg-pink/50 rounded-sm" />
                            <div className="w-2.5 h-2.5 bg-pink rounded-sm" />
                        </div>
                        <h2 className="text-3xl font-bold text-dark">Shop by Category</h2>
                    </div>
                    <Link href="/shop" className="text-pink font-semibold hover:text-pink-dark transition-colors flex items-center gap-2">
                        View All <span>→</span>
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-8 justify-items-center">
                    {bundles.map((bundle, index) => (
                        <div
                            key={index}
                            className="relative w-[340px] h-[340px] bg-white rounded-full flex flex-col items-center justify-center p-8 shadow-[0_0_50px_rgba(0,0,0,0.06)] border border-pink-50/50 transition-transform hover:-translate-y-2 hover:shadow-[0_10px_60px_rgba(244,114,182,0.15)] group"
                        >
                            {/* Floating Top Tag */}
                            <div className={`absolute top-0 -translate-y-1/2 px-4 py-1 rounded-full text-[10px] sm:text-xs whitespace-nowrap shadow-sm ${bundle.tagColor}`}>
                                {bundle.tag}
                            </div>

                            {/* Icon */}
                            <div className={bundle.iconContainer}>
                                {bundle.icon}
                            </div>

                            {/* Title & Rating */}
                            <h3 className="text-xl font-bold text-dark mt-2">{bundle.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <span className="text-yellow-400">⭐</span> {bundle.rating} ({bundle.reviews})
                            </div>

                            {/* Price */}
                            <div className="text-2xl font-bold text-pink mt-3">
                                Rs {bundle.price.toLocaleString()}
                            </div>

                            {/* Items List */}
                            <div className="flex items-start gap-1 mt-3 text-[10px] text-gray-400 text-center leading-tight h-[30px] overflow-hidden">
                                <span className="text-[10px] mt-0.5">🎁</span>
                                <p>{bundle.items}</p>
                            </div>

                            {/* COD Available */}
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                                <span>🚚</span> COD Available
                            </div>

                            {/* Button */}
                            <button
                                onClick={() => handleAddToCart(bundle)}
                                className={`absolute bottom-6 w-[80%] py-3 rounded-full font-medium text-sm transition-all transform group-hover:scale-105 ${addedStates[bundle.title] ? 'bg-pink-500 text-white shadow-[0_5px_15px_rgba(236,72,153,0.3)]' : 'bg-[#f64b73] text-white hover:bg-[#e03b62] shadow-[0_5px_15px_rgba(246,75,115,0.3)]'}`}
                            >
                                {addedStates[bundle.title] ? '✓ Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
