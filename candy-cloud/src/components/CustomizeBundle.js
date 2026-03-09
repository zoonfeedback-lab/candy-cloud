export default function CustomizeBundle() {
    return (
        <section id="customize" className="py-20 bg-white">
            <div className="max-w-[700px] mx-auto px-5 text-center flex flex-col items-center gap-4">
                <div className="w-[60px] h-[60px] flex items-center justify-center text-3xl bg-pink-light rounded-full mb-1">🍬</div>
                <h2 className="text-3xl font-bold">Customize Your Magic Bundle</h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-[500px]">
                    Pick your favorite stationery, beauty items, and cute accessories to build a bundle that&apos;s 100% you. Perfect for gifting or treating yourself!
                </p>
                <a href="#categories" className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-pink text-white font-semibold text-sm hover:bg-pink-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(244,114,182,0.4)] transition-all">
                    Start Customizing →
                </a>
            </div>
        </section>
    );
}
