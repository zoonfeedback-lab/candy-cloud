"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import PrizeSpinner from "./PrizeSpinner";

export default function Hero() {
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const { isAuthenticated, openAuthModal } = useAuth();
    const router = useRouter();

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }

        const item = {
            id: "hero-bundle-1",
            name: "Candy Cloud Aesthetic Bundle",
            price: 1500,
            emoji: "✨",
            qty: qty
        };
        const queryParams = new URLSearchParams({
            direct: "true",
            id: item.id,
            name: item.name,
            price: item.price,
            emoji: item.emoji,
            qty: item.qty
        }).toString();

        router.push(`/checkout?${queryParams}`);
    };

    return (
        <section className="relative bg-pink-light py-16 pb-20 overflow-hidden min-h-[520px]">
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-10 w-40 h-[200px] bg-yellow-accent rounded-br-[60%] opacity-60 z-0" />
            <div className="absolute top-10 left-[22%] text-[1.8rem] z-[1] animate-twinkle">⭐</div>
            <div className="absolute top-8 left-[48%] text-5xl z-[1] text-[#7dd3c0] animate-floatSlow">☁️</div>
            <div className="absolute top-16 right-16 text-3xl z-[1] animate-spin-slow">☀️</div>
            <div className="absolute top-[30%] right-24 w-[120px] h-[120px] border-[3px] border-pink/30 rounded-[50%_0_50%_50%] z-0 animate-spin-slower" />

            <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-[2]">
                {/* Left */}
                <div className="flex flex-col gap-7 md:order-none order-2">
                    <h1 className="text-5xl md:text-7xl font-black text-dark leading-[1.1] mb-5 tracking-tight">
                        Order Your<br />Cute Haul Today
                    </h1>
                    <p className="text-lg text-gray-700 mb-8 max-w-[450px] leading-relaxed">
                        Dive into our magical world of stationery, jewelry, and cute accessories. Build your perfect aesthetic bundle!
                    </p>
                    {/* Price + Qty + Buy */}
                    <div className="flex items-center gap-4 flex-wrap md:justify-start justify-center">
                        <span className="text-xl font-bold text-pink-dark">Rs 1,500</span>
                        <div className="flex items-center border-2 border-pink rounded-lg overflow-hidden">
                            <button
                                className="w-9 h-9 bg-pink text-white text-xl font-bold flex items-center justify-center hover:bg-pink-dark transition-colors"
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                aria-label="Decrease quantity"
                            >−</button>
                            <span className="w-10 text-center font-semibold text-dark">{qty}</span>
                            <button
                                className="w-9 h-9 bg-pink text-white text-xl font-bold flex items-center justify-center hover:bg-pink-dark transition-colors"
                                onClick={() => setQty(Math.min(50, qty + 1))}
                                aria-label="Increase quantity"
                            >+</button>
                        </div>
                        <button
                            onClick={handleBuyNow}
                            className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-2xl bg-dark text-white font-semibold text-sm tracking-wide hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-md"
                        >
                            BUY NOW
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-9 max-sm:gap-5 mt-1 md:justify-start justify-center">
                        {[
                            { num: "25K+", label: "Followers" },
                            { num: "10K+", label: "Our Customers" },
                            { num: "15K+", label: "Items Ordered" },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col">
                                <span className="text-2xl max-sm:text-xl font-extrabold text-dark">{s.num}</span>
                                <span className="text-sm text-pink-dark font-medium">{s.label}</span>
                            </div>
                        ))}
                        <div className="flex flex-col">
                            <span className="font-bold text-dark text-sm leading-tight">Quality<br />Guaranteed</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center md:order-none order-1">
                    <PrizeSpinner />
                </div>
            </div>
        </section>
    );
}
