"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const deals = [
    {
        subtitle: "CANDYCLOUD CURATED",
        title: "CandyCloud\nBasket",
        price: "Rs 2,500",
        bg: "bg-pink-light",
        border: "border-pink",
        decorBg: "bg-pink/40",
        decorShape: "rounded-[40%_60%_55%_45%/50%_45%_55%_50%]",
        emoji: "☀️",
        href: "/basket",
    },
    {
        subtitle: "10 PRODUCTS OF YOUR CHOICE",
        title: "Customize\nCloud Deal",
        price: "Rs 3,500",
        bg: "bg-sky-100",
        border: "border-green-400",
        decorBg: "bg-green-300/60",
        decorShape: "rounded-[55%_45%_50%_50%/45%_55%_50%_50%]",
        emoji: "🌈",
    },
];

export default function SpecialDeals() {
    return (
        <section className="py-20 bg-[#fdf6ec]">
            <div className="max-w-[1200px] mx-auto px-5">
                <h2 className="text-3xl font-bold text-center mb-3">
                    🎁 Special Deals
                </h2>
                <p className="text-base text-gray-500 text-center mb-12 max-w-[600px] mx-auto">
                    Grab our best-value bundles — curated with love or customized by you!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {deals.map((deal) => (
                        <DealCard key={deal.title} deal={deal} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function DealCard({ deal }) {
    const [qty, setQty] = useState(1);
    const router = useRouter();
    const { isAuthenticated, openAuthModal } = useAuth();

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }

        const numericPrice = parseInt(deal.price.replace(/[^0-9]/g, ''), 10);

        const queryParams = new URLSearchParams({
            direct: "true",
            id: `deal-${deal.title.replace(/\s+/g, '-').toLowerCase()}`,
            name: deal.title.replace('\n', ' '),
            price: numericPrice,
            emoji: deal.emoji,
            qty: qty
        }).toString();

        router.push(`/checkout?${queryParams}`);
    };

    // If the deal has an href, make the whole card a clickable link
    if (deal.href) {
        return (
            <a
                href={deal.href}
                className={`
                    relative ${deal.bg} rounded-2xl p-8 overflow-hidden
                    border-2 border-dashed ${deal.border}
                    hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer block group
                `}
            >
                <div className={`absolute -bottom-6 -left-6 w-32 h-32 ${deal.decorBg} ${deal.decorShape} opacity-70`} />
                <div className={`absolute -top-4 -right-4 w-28 h-28 ${deal.decorBg} ${deal.decorShape} opacity-50`} />
                <div className="absolute bottom-0 right-16 w-20 h-10 border-2 border-white/50 rounded-t-full opacity-60" />

                <div className="relative z-10">
                    <p className="text-xs font-semibold tracking-wider text-pink-dark uppercase mb-2">
                        {deal.subtitle}
                    </p>
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-dark leading-tight whitespace-pre-line">
                            {deal.title}
                        </h3>
                        <span className="text-4xl animate-spin-8">{deal.emoji}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-5">Gift basket for your loved ones 💝</p>
                    <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-dark text-white text-sm font-semibold group-hover:bg-gray-800 transition-colors">
                        View &amp; Customize →
                    </span>
                </div>
            </a>
        );
    }

    return (
        <div
            className={`
                relative ${deal.bg} rounded-2xl p-8 overflow-hidden
                border-2 border-dashed ${deal.border}
                hover:shadow-lg transition-shadow
            `}
        >
            <div className={`absolute -bottom-6 -left-6 w-32 h-32 ${deal.decorBg} ${deal.decorShape} opacity-70`} />
            <div className={`absolute -top-4 -right-4 w-28 h-28 ${deal.decorBg} ${deal.decorShape} opacity-50`} />
            <div className="absolute bottom-0 right-16 w-20 h-10 border-2 border-white/50 rounded-t-full opacity-60" />

            <div className="relative z-10">
                <p className="text-xs font-semibold tracking-wider text-pink-dark uppercase mb-2">
                    {deal.subtitle}
                </p>
                <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-dark leading-tight whitespace-pre-line">
                        {deal.title}
                    </h3>
                    <span className="text-4xl animate-spin-8">{deal.emoji}</span>
                </div>

                {/* Price + Qty + Buy */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-bold text-pink-dark">{deal.price}</span>

                    <div className="flex items-center border-2 border-pink rounded-lg overflow-hidden">
                        <button
                            className="w-8 h-8 bg-pink text-white text-lg font-bold flex items-center justify-center hover:bg-pink-dark transition-colors"
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="w-9 text-center font-semibold text-dark text-sm">{qty}</span>
                        <button
                            className="w-8 h-8 bg-pink text-white text-lg font-bold flex items-center justify-center hover:bg-pink-dark transition-colors"
                            onClick={() => setQty(qty + 1)}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleBuyNow}
                        className="px-6 py-2 rounded-2xl bg-dark text-white text-sm font-semibold hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
                    >
                        BUY NOW
                    </button>
                </div>
            </div>
        </div>
    );
}

