import Image from "next/image";

export default function Gallery() {
    return (
        <section className="py-24 bg-[#FEF2F4] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        Peek Inside the Magic <span className="animate-pulse">✨</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-[700px] mx-auto font-medium">
                        A glimpse into our colorful candy world — every box is a work of art!
                    </p>
                </div>

                {/* Complex Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
                    
                    {/* Left Panel: Large Vertical Feature */}
                    <div className="md:col-span-5 h-[500px] md:h-full relative group overflow-hidden rounded-[40px] shadow-2xl border-8 border-white">
                        <Image
                            src="/images/gallery-candy.png"
                            alt="Magical Candy Bowl"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                            <p className="text-white font-bold text-xl drop-shadow-md">Hand-picked Joy 🍬</p>
                        </div>
                    </div>

                    {/* Right Panel: Top Large + Bottom Grid */}
                    <div className="md:col-span-7 flex flex-col gap-6 h-full">
                        
                        {/* Top Right: Wide Feature (The Box) */}
                        <div className="h-[300px] md:h-[45%] relative group overflow-hidden rounded-[40px] shadow-xl border-8 border-white">
                            <Image
                                src="/images/gallery-box.png"
                                alt="Unboxing the Magic"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                <p className="text-white font-bold text-xl drop-shadow-md">The Ultimate Unboxing 📦</p>
                            </div>
                        </div>

                        {/* Bottom Right: 2x2 Mini Grid */}
                        <div className="h-[400px] md:h-[55%] grid grid-cols-2 grid-rows-2 gap-4">
                            <div className="relative group overflow-hidden rounded-[30px] shadow-lg border-4 border-white">
                                <Image
                                    src="/images/hero-candy.png"
                                    alt="Sweets"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="relative group overflow-hidden rounded-[30px] shadow-lg border-4 border-white">
                                <Image
                                    src="/images/candy-categories.png"
                                    alt="Colors"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="relative group overflow-hidden rounded-[30px] shadow-lg border-4 border-white">
                                <Image
                                    src="/images/how-it-works.png"
                                    alt="Magic"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="relative group overflow-hidden rounded-[30px] shadow-lg border-4 border-white bg-pink-100 flex items-center justify-center">
                                <div className="text-center p-4">
                                    <span className="text-4xl mb-2 block animate-bounce">🌈</span>
                                    <p className="text-pink-600 font-bold text-sm">More Magic Awaits</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
