"use client";

import PrizeSpinner from "./PrizeSpinner";

export default function Hero() {
    return (
        <section className="relative bg-pink-light py-12 pb-14 overflow-hidden min-h-[380px]">
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-10 w-32 h-[150px] bg-yellow-accent rounded-br-[60%] opacity-60 z-0" />
            <div className="absolute top-10 left-[22%] text-[1.8rem] z-[1] animate-twinkle">⭐</div>
            <div className="absolute top-8 left-[48%] text-5xl z-[1] text-[#7dd3c0] animate-floatSlow">☁️</div>
            <div className="absolute top-16 right-16 text-3xl z-[1] animate-spin-slow">☀️</div>
            <div className="absolute top-[30%] right-24 w-[100px] h-[100px] border-[3px] border-pink/30 rounded-[50%_0_50%_50%] z-0 animate-spin-slower" />

            <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-[2]">
                {/* Left */}
                <div className="flex flex-col gap-5 md:order-none order-2">
                    <h1 className="text-5xl md:text-7xl font-black text-dark leading-[1.1] tracking-tight">
                        Order Your<br />Cute Haul Today
                    </h1>
                    <p className="text-lg text-gray-700 max-w-[450px] leading-relaxed">
                        Dive into our magical world of stationery, jewelry, and cute accessories. Build your perfect aesthetic bundle!
                    </p>
                </div>

                <div className="flex justify-center items-center md:order-none order-1">
                    <PrizeSpinner />
                </div>
            </div>
        </section>
    );
}
