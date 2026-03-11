"use client";

import { useState } from "react";

const faqs = [
    { q: "What's in the Mystery Box?", a: "Every CandyCloud Mystery Box is packed with a mix of our best-selling stationery, cute accessories, beauty items, and magical surprises you won't find anywhere else." },
    { q: "Is the Cloud Nine deal real or mythical?", a: "Absolutely real! Our Cloud Nine deal lets you pick 10 premium items of your choice for just Rs 3,500. It's practically legendary." },
    { q: "Can I customize a gift box for a friend?", a: "Yes! Use our 'Custom Deal' feature to pick their favorite items, add a sweet note, and we'll ship it directly to them in a beautiful starry box." },
    { q: "Are the cosmetics and beauty items safe?", a: "Of course! We carefully source all items to ensure high quality. All lip balms, masks, and accessories are safe and skin-friendly." },
    { q: "How do I track my orders?", a: "Once your order is placed, you'll receive a tracking link via email and SMS. You can also check your order status in your account dashboard." },
    { q: "Do you offer international shipping?", a: "Currently we ship across Pakistan. International shipping is coming soon — stay tuned for updates!" },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-5">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 inline-block">
                        FAQs 🍬
                    </h2>
                    <p className="text-lg text-gray-500 max-w-[600px] mx-auto font-medium">
                        Got questions? We&apos;ve got cute answers!
                    </p>
                </div>

                <div className="relative rounded-[30px] p-8 md:p-12 transition-all duration-500 shadow-sm border border-white/50 bg-gradient-to-b from-[#f3efff] to-[#ffeaf5] overflow-hidden">

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-10 left-10 text-3xl animate-bounce opacity-70 blur-[1px]">☁️</div>
                    <div className="absolute top-20 right-20 text-2xl animate-pulse2 opacity-80">⭐</div>
                    <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce delay-1000 opacity-60">🍬</div>
                    <div className="absolute top-1/2 right-10 text-xl animate-pulse opacity-90 blur-[1px]">✨</div>

                    <div className="relative z-10 max-w-[750px] mx-auto flex flex-col gap-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${openIndex === i ? "shadow-[0_4px_20px_rgba(244,114,182,0.15)]" : ""}`}
                            >
                                <button
                                    className="w-full flex items-center gap-3 px-5 py-4 bg-transparent text-base font-semibold text-dark text-left"
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    aria-expanded={openIndex === i}
                                >
                                    <span className="text-xl flex-shrink-0">🍬</span>
                                    <span className="flex-1">{faq.q}</span>
                                    <span className="text-xl font-bold text-pink flex-shrink-0 transition-transform">
                                        {openIndex === i ? "−" : "+"}
                                    </span>
                                </button>
                                <div
                                    className="overflow-hidden transition-all duration-300"
                                    style={{ maxHeight: openIndex === i ? "200px" : "0px" }}
                                >
                                    <p className="px-5 pb-4 pl-[52px] text-sm text-gray-500 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
