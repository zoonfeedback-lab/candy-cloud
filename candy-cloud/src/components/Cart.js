"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

    const subtotal = cartTotal;
    const tax = 0.00;
    const total = subtotal + tax;

    if (cartItems.length === 0) {
        return (
            <section className="py-24 px-5 max-w-[1100px] mx-auto w-full flex flex-col items-center justify-center text-center min-h-[50vh]">
                <div className="text-7xl mb-6 animate-floatSlow">☁️</div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 tracking-tight">Your Cart is Floating Away!</h1>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">It looks like you haven't added any magic to your stash yet. Let's fix that!</p>
                <Link href="/shop" className="px-8 py-4 rounded-xl bg-pink text-white font-black tracking-wide text-lg shadow-[0_8px_20px_rgba(244,114,182,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(244,114,182,0.4)] transition-all">
                    Shop for Sweet Treats ✨
                </Link>
            </section>
        );
    }

    return (
        <section className="py-12 px-5 max-w-[1100px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-10 items-start">

                {/* Left Column: Your Magic Stash */}
                <div className="flex-1 w-full">
                    <div className="flex items-baseline gap-3 mb-8">
                        <h1 className="text-3xl md:text-4xl font-black italic text-gray-800 tracking-tight uppercase">
                            YOUR MAGIC STASH
                        </h1>
                        <span className="font-bold text-pink-500 text-sm md:text-base">
                            ({cartItems.length} items found!)
                        </span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {cartItems.map((item, index) => {
                            // Assign unique "remove" text per index based on mockup
                            let removeText = "CHUCK IT";
                            if (index === 1) removeText = "NOT FEELING IT";
                            if (index === 2) removeText = "TOO MUCH MAGIC?";

                            return (
                                <div key={item.id + '-' + index} className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center gap-6 relative group transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)]">

                                    {/* Item Image */}
                                    <div className={`w-32 h-32 rounded-2xl border-4 border-dashed border-pink-200 p-2 flex-shrink-0 bg-[#fffdf8]`}>
                                        <div className={`w-full h-full rounded-xl bg-pink-100 shadow-inner flex items-center justify-center`}>
                                            <span className="text-4xl opacity-80">{item.emoji || "🎁"}</span>
                                        </div>
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.type}</span>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug">{item.name}</h3>
                                        {item.items && (
                                            <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3 mb-2 max-w-[320px]">
                                                <span className="text-[10px] font-black text-pink-600 tracking-widest uppercase mb-1 block">✨ Includes:</span>
                                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                                    {item.items.split(', ').map((subItem, idx) => (
                                                        <span key={idx} className="inline-block bg-white border border-pink-100 shadow-sm px-2 py-0.5 rounded-md mr-1.5 mb-1.5 text-gray-700">
                                                            {subItem}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        )}
                                        <div className="text-xl font-black text-pink-500 mt-1">
                                            Rs {item.price.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Quantity & Actions */}
                                    <div className="flex flex-col items-center sm:items-end gap-3 pr-2">
                                        <div className="flex items-center gap-4 bg-[#f4f6fa] rounded-full px-4 py-2 w-[120px] justify-between shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="text-gray-500 hover:text-gray-800 font-bold w-6 text-center text-lg leading-none transition-colors"
                                                aria-label="Decrease quantity"
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <span className="font-bold text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="text-gray-500 hover:text-gray-800 font-bold w-6 text-center text-lg leading-none transition-colors"
                                                aria-label="Increase quantity"
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[10px] font-bold tracking-wider text-teal-400/80 hover:text-teal-500 underline underline-offset-4 decoration-current transition-colors uppercase mt-1 cursor-pointer"
                                        >
                                            {removeText}
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-[400px] bg-white rounded-[24px] p-8 lg:p-10 ring-4 ring-yellow-50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sticky top-24 shrink-0 border border-yellow-100">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Summary</h2>
                        <p className="text-xs text-gray-400 font-bold mt-1">(Cheaper than Therapy)</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-500">Sweetness Subtotal</span>
                            <span className="font-bold text-gray-800">Rs {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-500">Magical Shipping</span>
                            <span className="font-black text-teal-400">FREE</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-500">Tax for the Trolls</span>
                            <span className="font-bold text-gray-800">Rs {tax.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-100 mb-6 relative">
                        {/* Decorative side circles marking the dashed line */}
                        <div className="absolute -left-10 -top-2.5 w-5 h-5 bg-[#f8f9fa] rounded-full"></div>
                        <div className="absolute -right-10 -top-2.5 w-5 h-5 bg-[#f8f9fa] rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xl font-black text-gray-800">Total Happiness</span>
                        <span className="text-3xl font-black text-pink-500">Rs {total.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col gap-4 mb-10">
                        <Link href="/checkout" className="w-full py-4 rounded-xl bg-pink-500 text-white font-black tracking-wide text-lg text-center shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_25px_rgba(236,72,153,0.4)] hover:-translate-y-1 transition-all inline-block hover:text-white">
                            TAKE MY MONEY!
                        </Link>
                        <Link href="/shop" className="w-full py-4 rounded-xl font-bold bg-[#e6fbf7] text-teal-500 hover:bg-[#d5f5ee] transition-colors text-center inline-block">
                            Continue Shopping for Magic
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-12 border-t border-gray-50 pt-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm3-9h2m-2 4h2m-2-4v4m-4-4v4m-4-4v4m-4-4v4m0 0H3m2 0V9a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 tracking-wider">CASH ON DELIVERY</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.65 2 6.32 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zm4.5 5.35a.75.75 0 00-1.06-1.06L9 10.69 7.06 8.75a.75.75 0 00-1.06 1.06l2.47 2.47a.75.75 0 001.06 0l5-5z" clipRule="evenodd"></path></svg>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 tracking-wider">SECURE CHECKOUT</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
