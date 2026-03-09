"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Configuration Options
const SCOOP_SIZES = [
    { id: "mini", name: "Mini Scoop", weight: "250g", price: 500, emoji: "🥄" },
    { id: "mega", name: "Mega Scoop", weight: "500g", price: 900, emoji: "🥣" },
    { id: "ultimate", name: "Ultimate Bucket", weight: "1kg", price: 1600, emoji: "🪣" },
];

const COLOR_THEMES = [
    { id: "rainbow", name: "Rainbow Riot", emoji: "🌈", bgRaw: "bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100", activeClass: "border-pink-400 ring-pink-200" },
    { id: "pink", name: "Pink Princess", emoji: "🎀", bgRaw: "bg-gradient-to-br from-pink-100 to-rose-100", activeClass: "border-pink-500 ring-pink-300" },
    { id: "blue", name: "Blue Lagoon", emoji: "🌊", bgRaw: "bg-gradient-to-br from-blue-100 to-cyan-100", activeClass: "border-blue-400 ring-blue-200" },
    { id: "mystery", name: "Mystery Mix", emoji: "🃏", bgRaw: "bg-gradient-to-br from-purple-100 to-indigo-100", activeClass: "border-purple-400 ring-purple-200" },
];

const CATEGORY_PREFS = [
    { id: "sweet-treat", name: "Sweet Treat", emoji: "🍬" },
    { id: "dreamy-delight", name: "Dreamy Delight", emoji: "☁️" },
    { id: "cloud-nine", name: "Cloud Nine", emoji: "🧁" },
];

const FLAVOR_PROFILES = [
    { id: "sweet", name: "Sweet & Fruity", emoji: "🍓" },
    { id: "sour", name: "Sour Power", emoji: "⚡" },
    { id: "chocolate", name: "Chocolate Dream", emoji: "🍫" },
    { id: "anything", name: "Anything Goes!", emoji: "🎲" },
];

export default function Scoop() {
    const { addToCart } = useCart();
    const { isAuthenticated, openAuthModal } = useAuth();

    // State
    const [selectedSize, setSelectedSize] = useState(SCOOP_SIZES[0]);
    const [selectedColor, setSelectedColor] = useState(COLOR_THEMES[0]);
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_PREFS[0]);
    const [selectedFlavor, setSelectedFlavor] = useState(FLAVOR_PROFILES[0]);
    const [quantity, setQuantity] = useState(1);

    const [addedFeedback, setAddedFeedback] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    // Derived
    const totalPrice = selectedSize.price * quantity;

    const handleAddMysteryToCart = () => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }

        const mysteryItem = {
            id: `mystery-scoop-${Date.now()}`,
            name: `Custom Mystery Scoop (${selectedSize.name})`,
            price: selectedSize.price, // Cart context multiplies by qty automatically
            emoji: selectedColor.emoji,
            type: "Custom Cup",
            description: `Category: ${selectedCategory.name} | Theme: ${selectedColor.name} | Flavor: ${selectedFlavor.name} | Weight: ${selectedSize.weight}`
        };

        addToCart(mysteryItem, quantity);

        // Feedback animation
        setIsPulsing(true);
        setAddedFeedback(true);

        setTimeout(() => {
            setAddedFeedback(false);
            setIsPulsing(false);
            // Reset to default
            setQuantity(1);
        }, 1500);
    };

    return (
        <section
            id="scoop"
            className="py-24 relative overflow-hidden"
            style={{
                background: `
                    radial-gradient(circle at 20% 30%, #ffe3f1, transparent 40%),
                    radial-gradient(circle at 80% 60%, #e6f7ff, transparent 40%),
                    linear-gradient(180deg, #fdf7fb, #f3f7ff)
                `
            }}
        >
            {/* Soft background floating elements */}
            <div className={`absolute top-10 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob transition-colors duration-1000 ${selectedColor.id === 'blue' ? 'bg-blue-300' : selectedColor.id === 'mystery' ? 'bg-purple-300' : 'bg-pink-200'}`}></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className={`absolute -bottom-8 left-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 transition-colors duration-1000 ${selectedColor.id === 'rainbow' ? 'bg-yellow-200' : 'bg-pink-200'}`}></div>

            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-3xl animate-bounce">✨</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 pb-2">
                            Mystery Scoop Configurator 🎁
                        </h2>
                        <span className="text-3xl animate-bounce delay-100">✨</span>
                    </div>
                    {/* Wavy underline accent */}
                    <div className="flex justify-center mb-6">
                        <svg className="w-32 h-3" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
                        You choose the vibe, we pack the surprise! Build your <span className="text-pink font-extrabold">Mystery Scoop</span> by picking your size, color theme, and preferred flavors.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Configuration Form */}
                    <div className="lg:col-span-7 space-y-10">

                        {/* 1. Category Preference (Moved to top by User Request) */}
                        <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-md rounded-3xl p-8 border-2 border-pink-100 shadow-[0_8px_30px_rgba(236,72,153,0.08)] relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 text-[100px] opacity-10 rotate-12">🍭</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 relative z-10">
                                <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">1</span>
                                Choose Category Preference
                                <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Most Popular</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                {CATEGORY_PREFS.map((cat) => {
                                    const isSelected = selectedCategory.id === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`
                                                relative p-6 rounded-[24px] flex flex-col items-center gap-3 transition-all duration-300 overflow-hidden group
                                                border-2 ${isSelected ? "border-pink-500 shadow-[0_10px_30px_rgba(236,72,153,0.3)] scale-[1.03] -translate-y-1" : "border-pink-50 bg-white/60 hover:bg-white hover:border-pink-200 hover:shadow-lg hover:-translate-y-1"}
                                            `}
                                        >
                                            {/* Dynamic vibrant background when selected */}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-white to-purple-100/80 opacity-100 z-0"></div>
                                            )}

                                            {/* The Emoji Icon Box */}
                                            <div className={`
                                                relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl transition-transform duration-500 
                                                ${isSelected ? "bg-white shadow-md scale-110" : "bg-pink-50 group-hover:bg-pink-100 group-hover:scale-110"}
                                            `}>
                                                {cat.emoji}
                                                {isSelected && <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white animate-bounce"></div>}
                                            </div>

                                            {/* Text Selection */}
                                            <span className={`relative z-10 text-lg font-black tracking-wide text-center mt-1 leading-tight ${isSelected ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 drop-shadow-sm' : 'text-gray-600 group-hover:text-pink-500'}`}>
                                                {cat.name}
                                            </span>

                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Size Selection */}
                        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Choose your Size
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {SCOOP_SIZES.map((size) => {
                                    const isSelected = selectedSize.id === size.id;
                                    return (
                                        <button
                                            key={size.id}
                                            onClick={() => setSelectedSize(size)}
                                            className={`
                                                relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300
                                                border-2 ${isSelected ? "border-pink-400 bg-pink-50 ring-4 ring-pink-50 shadow-md scale-105" : "border-gray-100 bg-white hover:border-pink-200 hover:bg-gray-50"}
                                            `}
                                        >
                                            {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>}
                                            {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full"></div>}

                                            <span className="text-4xl mb-3">{size.emoji}</span>
                                            <span className="font-bold text-gray-800 text-md">{size.name}</span>
                                            <span className="text-xs font-bold text-pink-500 bg-pink-100 px-2 py-1 rounded-full mt-2 mb-1">{size.weight}</span>
                                            <span className="text-gray-500 text-sm font-semibold">Rs {size.price}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Color Theme */}
                        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                Pick a Color Theme
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {COLOR_THEMES.map((theme) => {
                                    const isSelected = selectedColor.id === theme.id;
                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedColor(theme)}
                                            className={`
                                                p-4 rounded-2xl flex items-center gap-4 transition-all duration-300
                                                border-2 ${isSelected ? theme.activeClass + ` bg-white shadow-md ring-4 scale-[1.02]` : "border-gray-100 bg-white hover:border-gray-300"}
                                            `}
                                        >
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner ${theme.bgRaw}`}>
                                                {theme.emoji}
                                            </div>
                                            <span className={`font-bold text-left ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{theme.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. Flavor Profile */}
                        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                Flavor Profile
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {FLAVOR_PROFILES.map((flavor) => {
                                    const isSelected = selectedFlavor.id === flavor.id;
                                    return (
                                        <button
                                            key={flavor.id}
                                            onClick={() => setSelectedFlavor(flavor)}
                                            className={`
                                                p-4 rounded-2xl flex items-center gap-3 transition-all duration-300
                                                border-2 ${isSelected ? "border-pink-400 bg-pink-50 ring-4 ring-pink-50 shadow-sm" : "border-gray-100 bg-white hover:bg-gray-50"}
                                            `}
                                        >
                                            <span className="text-2xl">{flavor.emoji}</span>
                                            <span className={`font-bold ${isSelected ? 'text-pink-600' : 'text-gray-600'}`}>{flavor.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Mystery Cup Summary */}
                    <div className="lg:col-span-5 relative">
                        {/* Sticky container */}
                        <div className={`sticky top-24 transition-transform duration-500 ${isPulsing ? 'scale-105' : 'scale-100'}`}>

                            <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white">

                                {/* Dynamic Header / "The Cup" */}
                                <div className={`h-48 relative flex items-center justify-center overflow-hidden transition-all duration-700 ${selectedColor.bgRaw}`}>
                                    {/* Abstract shapes inside header */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/30 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>

                                    <div className="text-center z-10 relative">
                                        <div className="text-7xl mb-2 filter drop-shadow-lg animate-bounce (slow)">
                                            {selectedSize.emoji}
                                        </div>
                                    </div>

                                    {/* Magical sparkles */}
                                    <div className="absolute top-8 left-12 text-white/50 animate-pulse2">✨</div>
                                    <div className="absolute bottom-10 right-16 text-white/60 animate-pulse delay-500">✨</div>
                                    <div className="absolute top-1/2 right-1/4 text-white/40 text-sm animate-bounce delay-1000">🌟</div>
                                </div>

                                {/* Body */}
                                <div className="p-8">
                                    <h3 className="text-2xl font-black text-gray-800 mb-6 text-center">Your Mystery Order</h3>

                                    <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">

                                        <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                                            <span className="text-gray-500 font-medium text-sm">Size</span>
                                            <div className="text-right">
                                                <span className="font-bold text-gray-800 block">{selectedSize.name}</span>
                                                <span className="text-xs text-pink-500 font-bold">{selectedSize.weight}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                                            <span className="text-gray-500 font-medium text-sm">Category</span>
                                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                                {selectedCategory.name} {selectedCategory.emoji}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                                            <span className="text-gray-500 font-medium text-sm">Theme</span>
                                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                                {selectedColor.name} {selectedColor.emoji}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 font-medium text-sm">Flavor</span>
                                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                                {selectedFlavor.name} {selectedFlavor.emoji}
                                            </span>
                                        </div>

                                    </div>

                                    {/* Quantity & Total */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center bg-gray-100 rounded-full p-1">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold hover:bg-pink-100 hover:text-pink-600 transition-colors flex items-center justify-center shadow-sm"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-bold text-gray-800">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold hover:bg-pink-100 hover:text-pink-600 transition-colors flex items-center justify-center shadow-sm"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                                                Rs {totalPrice}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        disabled={addedFeedback}
                                        onClick={handleAddMysteryToCart}
                                        className={`
                                            w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-2
                                            ${addedFeedback
                                                ? "bg-green-500 text-white shadow-[0_10px_25px_rgba(34,197,94,0.4)] scale-[0.98]"
                                                : "bg-gray-900 text-white hover:bg-pink-500 hover:shadow-[0_10px_30px_rgba(236,72,153,0.3)] hover:-translate-y-1"
                                            }
                                        `}
                                    >
                                        {addedFeedback ? (
                                            <>Added to Cart! <span className="text-2xl">🪄</span></>
                                        ) : (
                                            <>Add Mystery Cup <span className="text-2xl">🛒</span></>
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Trust badges below */}
                            <div className="flex justify-center gap-4 mt-6 opacity-70">
                                <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-white/50 px-3 py-1.5 rounded-full border border-gray-200">
                                    🌈 Premium Quality
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-white/50 px-3 py-1.5 rounded-full border border-gray-200">
                                    🚀 Ships in 24h
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
