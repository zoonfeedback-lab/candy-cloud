"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function MysteryBuilder({
    title,
    description,
    categories,
    sizes,
    themes,
    itemsList,
    listTitle,
    categoryStepLabel = "Choose Category Preference",
    sizeStepLabel = "Choose your Size",
    themeStepLabel = "Pick a Color Theme",
    productIdPrefix = "mystery-scoop",
    productType = "Custom Cup",
}) {
    const { addToCart } = useCart();
    const { isAuthenticated, openAuthModal } = useAuth();

    // State, initializing with the first options from props
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(themes[0]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
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
            id: `${productIdPrefix}-${Date.now()}`,
            name: `${title} (${selectedSize.name})`,
            price: selectedSize.price, // Cart context multiplies by qty automatically
            emoji: selectedColor.emoji,
            type: productType,
            description: `Category: ${selectedCategory.name} | Theme: ${selectedColor.name} | Size: ${selectedSize.weight}`
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
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 inline-block whitespace-pre-line">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-500 max-w-[600px] mx-auto font-medium whitespace-pre-line">
                        {description}
                    </p>
                </div>

                <div className="relative rounded-[30px] p-8 md:p-12 transition-all duration-500 shadow-sm border border-white/50 bg-gradient-to-b from-[#f3efff] to-[#ffeaf5] overflow-hidden">

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-10 left-10 text-3xl animate-bounce opacity-70 blur-[1px]">☁️</div>
                    <div className="absolute top-20 right-20 text-2xl animate-pulse2 opacity-80">⭐</div>
                    <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce delay-1000 opacity-60">🍬</div>
                    <div className="absolute top-1/2 right-10 text-xl animate-pulse opacity-90 blur-[1px]">✨</div>

                    <div className="relative z-10">

                        {/* 1. Category Preference (Moved to top and made full-width) */}
                        <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-md rounded-3xl p-8 border-2 border-pink-100 shadow-[0_8px_30px_rgba(236,72,153,0.08)] relative overflow-hidden mb-10">
                            <div className="absolute -top-10 -right-10 text-[100px] opacity-10 rotate-12">🍭</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 relative z-10">
                                <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">1</span>
                                {categoryStepLabel}
                                <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Most Popular</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                                {categories.map((cat) => {
                                    const isSelected = selectedCategory.id === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`
                                                relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 h-full
                                                border-2 ${isSelected ? "border-pink-400 bg-pink-200 ring-4 ring-pink-100 shadow-md scale-105" : "border-gray-100 bg-white hover:border-pink-200 hover:bg-gray-50"}
                                            `}
                                        >
                                            {cat.emoji && <span className="text-4xl mb-3">{cat.emoji}</span>}
                                            {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-12 h-12 object-contain mb-3" />}
                                            <span className="font-bold text-gray-800 text-md">{cat.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                            {/* Left Column: Configuration Form */}
                            <div className="lg:col-span-6 flex flex-col h-full gap-8">

                                {/* 2. Size Selection */}
                                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                        <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                        {sizeStepLabel}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                        {sizes.map((size) => {
                                            const isSelected = selectedSize.id === size.id;
                                            return (
                                                <button
                                                    key={size.id}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`
                                                relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 h-full
                                                border-2 ${isSelected ? "border-pink-400 bg-pink-200 ring-4 ring-pink-100 shadow-md scale-105" : "border-gray-100 bg-white hover:border-pink-200 hover:bg-gray-50"}
                                            `}
                                                >
                                                    {size.emoji && <span className="text-4xl mb-3">{size.emoji}</span>}
                                                    <span className="font-bold text-gray-800 text-md">{size.name}</span>
                                                    {size.weight && (
                                                        <span className="text-xs font-bold text-pink-500 bg-pink-100 px-2 py-1 rounded-full mt-2 mb-1">{size.weight}</span>
                                                    )}
                                                    <span className="text-gray-500 text-sm font-semibold">Rs {size.price}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 3. Color Theme */}
                                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                        <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                        {themeStepLabel}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                        {themes.map((theme) => {
                                            const isSelected = selectedColor.id === theme.id;
                                            return (
                                                <button
                                                    key={theme.id}
                                                    onClick={() => setSelectedColor(theme)}
                                                    className={`
                                                p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 h-full
                                                border-2 ${isSelected ? theme.activeClass + ` bg-pink-200 shadow-md ring-4 scale-[1.02]` : "border-gray-100 bg-white hover:border-gray-300"}
                                            `}
                                                >
                                                    <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-2xl shadow-inner ${theme.bgRaw || 'bg-gray-100'}`}>
                                                        {theme.emoji}
                                                    </div>
                                                    <span className={`font-bold text-left ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{theme.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Mystery Cup Summary */}
                            <div className="lg:col-span-6 relative h-full flex flex-col">
                                {/* Summary container */}
                                <div className={`transition-transform duration-500 flex-1 flex flex-col ${isPulsing ? 'scale-105' : 'scale-100'}`}>

                                    <div className="bg-white flex flex-col h-full justify-between rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white">

                                        {/* Dynamic Header / "The Cup" */}
                                        <div className={`h-48 relative flex items-center justify-center overflow-hidden transition-all duration-700 ${selectedColor.bgRaw || 'bg-gradient-to-r from-pink-300 to-purple-300'}`}>
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
                                        <div className="p-8 flex-1 flex flex-col justify-between">
                                            <div className="w-full">
                                                <h3 className="text-2xl font-black text-gray-800 mb-6 text-center">Your Mystery Order</h3>

                                                <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">

                                                    <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                                                        <span className="text-gray-500 font-medium text-sm">Size</span>
                                                        <div className="text-right">
                                                            <span className="font-bold text-gray-800 block">{selectedSize.name}</span>
                                                            {selectedSize.weight && <span className="text-xs text-pink-500 font-bold">{selectedSize.weight}</span>}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                                                        <span className="text-gray-500 font-medium text-sm">Category</span>
                                                        <span className="font-bold text-gray-800 flex items-center gap-2 text-right">
                                                            {selectedCategory.name} {selectedCategory.emoji}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-500 font-medium text-sm">Theme</span>
                                                        <span className="font-bold text-gray-800 flex items-center gap-2 text-right">
                                                            {selectedColor.name} {selectedColor.emoji}
                                                        </span>
                                                    </div>

                                                </div>

                                                <div className="w-full mt-auto pt-6">
                                                    {/* Quantity & Total */}
                                                    <div className="flex items-center justify-between mb-8">
                                                        <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
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
                                                                onClick={() => setQuantity(Math.min(50, quantity + 1))}
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
                                                            <>Add To Cart <span className="text-2xl">🛒</span></>
                                                        )}
                                                    </button>
                                                </div>

                                            </div>
                                        </div>

                                        {/* Trust badges below */}
                                        <div className="flex justify-center gap-4 mt-6 opacity-70">
                                            <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-white/50 px-3 py-1.5 rounded-full border border-gray-200">
                                                🌈 Premium Quality
                                            </span>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Items listed in the scoop */}
                        {itemsList && itemsList.length > 0 && (
                            <div className="mt-14 pt-10 border-t border-pink-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-center gap-3">
                                    <span className="text-2xl">✨</span> 
                                    {listTitle || "Items in this Pack"}
                                    <span className="text-2xl">✨</span>
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {itemsList.map((item, i) => (
                                        <span key={i} className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-600 border border-pink-50 shadow-sm hover:scale-105 hover:bg-pink-100 hover:text-pink-600 transition-all cursor-default">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
