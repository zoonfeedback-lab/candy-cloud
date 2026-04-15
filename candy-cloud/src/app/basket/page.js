"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function BasketPage() {
    const [selectedPrice, setSelectedPrice] = useState(1500);
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState("");
    const router = useRouter();

    const priceOptions = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
    const [saving, setSaving] = useState(false);
    const { isAuthenticated, openAuthModal, authFetch } = useAuth();

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }

        setSaving(true);
        try {
            // Save configuration to database
            const configPayload = {
                type: "basket",
                settings: {
                    id: "candycloud-basket",
                    name: "CandyCloud Basket",
                    price: selectedPrice,
                    emoji: "🎁",
                    qty: qty,
                    note: note.trim() || "",
                }
            };

            const res = await authFetch("/api/custom-configs", {
                method: "POST",
                body: JSON.stringify(configPayload),
            });

            const data = await res.json();
            if (data.success && data.configId) {
                // Redirect with configId
                router.push(`/checkout?direct=true&configId=${data.configId}`);
            } else {
                throw new Error(data.message || "Failed to save configuration");
            }
        } catch (err) {
            console.error("Save config error:", err);
            // Fallback to URL method if save fails
            const queryParams = new URLSearchParams({
                direct: "true",
                id: "candycloud-basket",
                name: "CandyCloud Basket",
                price: selectedPrice,
                emoji: "🎁",
                qty: qty,
                ...(note.trim() && { note: note.trim() })
            }).toString();
            router.push(`/checkout?${queryParams}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
            <section className="max-w-[700px] mx-auto px-5 py-16 md:py-24">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-xs font-bold tracking-[0.2em] text-pink-400 uppercase mb-3">
                        CANDYCLOUD CURATED
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                        CandyCloud<br />Basket
                    </h1>
                    <p className="text-base text-gray-500 max-w-[400px] mx-auto leading-relaxed">
                        Gift basket for your loved ones 💝
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8 md:p-10 relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl" />

                    <div className="relative z-10">
                        {/* Text box */}
                        <label className="block mb-2">
                            <span className="text-sm font-bold text-gray-700">
                                Tell us about your basket ✨
                            </span>
                            <span className="block text-xs text-gray-400 mt-1">
                                What kind of products would you like? Who is this basket for?
                            </span>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. I'd like stationery items and hair accessories for my sister Sara's birthday 🎂"
                            className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-pink-200 bg-pink-50/30 text-gray-700 text-sm placeholder:text-gray-300 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all resize-none mb-6"
                        />

                        {/* Budget / Price Selection */}
                        <div className="mb-8">
                            <label className="block mb-3">
                                <span className="text-sm font-bold text-gray-700">
                                    Choose your budget ✨
                                </span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {priceOptions.map((price) => (
                                    <button
                                        key={price}
                                        onClick={() => setSelectedPrice(price)}
                                        className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${
                                            selectedPrice === price
                                                ? "border-pink-500 bg-pink-500 text-white shadow-md scale-105"
                                                : "border-pink-100 bg-white text-gray-600 hover:border-pink-300"
                                        }`}
                                    >
                                        Rs {price.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price + Qty + Buy Row */}
                        <div className="flex items-center gap-4 flex-wrap pb-2">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Total Per Basket</span>
                                <span className="text-3xl font-extrabold text-pink-500">Rs {selectedPrice.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center border-2 border-pink-300 rounded-xl overflow-hidden">
                                <button
                                    className="w-10 h-10 bg-pink-400 text-white text-xl font-bold flex items-center justify-center hover:bg-pink-500 transition-colors"
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <span className="w-12 text-center font-bold text-gray-800">{qty}</span>
                                <button
                                    className="w-10 h-10 bg-pink-400 text-white text-xl font-bold flex items-center justify-center hover:bg-pink-500 transition-colors"
                                    onClick={() => setQty(Math.min(50, qty + 1))}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                disabled={saving}
                                className={`px-8 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all tracking-wide ml-auto ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {saving ? "SAVING..." : "BUY NOW"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
