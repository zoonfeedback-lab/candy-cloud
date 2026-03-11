"use client";

import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // Clear the user's cart securely because they've just completed the purchase
        clearCart();
        
        // Grab the orderId from the URL if present
        const id = searchParams.get('orderId');
        if (id) {
            setOrderId(id);
        }
    }, [clearCart, searchParams]);

    return (
        <section className="py-16 md:py-24 px-5 max-w-[800px] mx-auto w-full flex flex-col items-center text-center">

            {/* Organic Hero Graphic */}
            <div className="relative mb-12">
                {/* Floating Decorators */}
                <div className="absolute -top-4 -left-8 text-2xl animate-bounce delay-100 opacity-80 decoration-pink-300">🎀</div>
                <div className="absolute top-0 -right-12 text-3xl animate-pulse2 opacity-90">⭐</div>
                <div className="absolute bottom-4 right-[-40px] text-xl animate-bounce delay-500 opacity-60">☁️</div>

                {/* Main Organic Blob */}
                <div className="w-48 h-48 md:w-56 md:h-56 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.06)] flex items-center justify-center relative z-10" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                    {/* Abstract Stork/Cart Icon matching the Pink Theme */}
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform -translate-y-2">
                        <circle cx="9" cy="21" r="1.5" fill="#ec4899" />
                        <circle cx="20" cy="21" r="1.5" fill="#ec4899" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        <path d="M10 11l4-4 4 4" />
                    </svg>

                    {/* Small inner highlight blob */}
                    <div className="absolute top-4 right-6 w-12 h-12 bg-yellow-100/80 rounded-full flex items-center justify-center -space-y-1 transform rotate-12 shadow-sm animate-pulse">
                        <span className="text-xl">🎉</span>
                    </div>
                </div>
            </div>

            {/* Typography */}
            <h1 className="text-3xl md:text-5xl font-black text-[#1a1f36] tracking-tight mb-4 leading-tight">
                Hooray! The Sugar Scouts are on the move!
            </h1>
            <p className="text-[#6b7280] text-sm md:text-base font-medium max-w-[500px] mb-14 leading-relaxed">
                {orderId ? (
                    <>Your order <span className="font-black text-pink-500">#{orderId.substring(orderId.length - 6).toUpperCase()}</span> has been received.</>
                ) : (
                    <>Your lovely order has been received.</>
                )} Our friendly storks are currently packing your sweets with extra love and fluff.
            </p>

            {/* Order Progress Tracker */}
            <div className="w-full max-w-[600px] mb-16 px-4">
                <div className="relative flex items-center justify-between w-full">

                    {/* The Background Line */}
                    <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
                    {/* The Active Line (Filled partway) */}
                    <div className="absolute top-6 left-0 w-[20%] h-1 bg-pink-500 z-0 rounded-full transition-all duration-1000"></div>

                    {/* Step 1: Active */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-24">
                        <div className="w-12 h-12 rounded-full bg-white border-4 border-pink-500 flex items-center justify-center text-pink-500 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-[10px] sm:text-xs font-black text-pink-500 text-center tracking-wide">ORDER PLACED</span>
                    </div>

                    {/* Step 2: Pending */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-24 translate-y-[-2px]">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 text-center tracking-wide">SWEET SORTING</span>
                    </div>

                    {/* Step 3: Pending */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-24 translate-y-[-2px]">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="M22 4L12 14.01l-3-3"></path></svg>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 text-center tracking-wide">STORK TRANSIT</span>
                    </div>

                    {/* Step 4: Pending */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-24 translate-y-[-2px]">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400 mb-[4px]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 text-center tracking-wide">DOORSTEP DELIGHT</span>
                    </div>

                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full max-w-[480px]">
                <a href="/shop" className="w-full sm:w-auto flex-1 py-4 px-6 rounded-xl bg-pink-500 text-white font-black tracking-wide text-sm sm:text-base shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(236,72,153,0.4)] transition-all flex items-center justify-center gap-2">
                    Keep Shopping for Sweets <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </a>
                <a href={orderId ? `/track?q=${orderId}` : "/track"} className="w-full sm:w-auto flex-1 py-4 px-6 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 font-bold tracking-wide text-sm sm:text-base transition-colors flex items-center justify-center gap-2">
                    Track My Stork <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </a>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-gray-400 italic">
                Estimated arrival time: When the wind is just right (and according to your shipping choice).
            </p>
        </section>
    );
}

export default function Success() {
    return (
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-pink-500 font-bold">Summoning storks... 🎁</div>}>
            <SuccessContent />
        </Suspense>
    );
}
