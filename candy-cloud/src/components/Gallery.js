import Image from "next/image";

export default function Gallery() {
    return (
        <section className="py-24 bg-[#FEF2F4] relative overflow-hidden">
            {/* Soft decorative background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-100 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px] opacity-30"></div>
            </div>

            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        Peek Inside the Magic <span className="animate-pulse">✨</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-[700px] mx-auto font-medium">
                        A glimpse into our colorful candy world — every box is a work of art!
                    </p>
                </div>

                {/* Complex Grid Layout - Seamless Moodboard */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-auto md:h-[800px] shadow-2xl rounded-[40px] overflow-hidden">

                    {/* Left Panel: Feature Pink Box */}
                    <div className="md:col-span-5 h-[500px] md:h-full relative group overflow-hidden border-r border-white/20">
                        <Image
                            src="/images/gallery-pink-box1.jpeg"
                            alt="Magical Pink Box"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                            <p className="text-white font-bold text-xl drop-shadow-md">Pink Perfection 🎀</p>
                        </div>
                    </div>

                    {/* Right Panel: Top Blue Box + Bottom Grid */}
                    <div className="md:col-span-7 flex flex-col gap-0 h-full">

                        {/* Top Right: Feature Blue Box */}
                        <div className="h-[300px] md:h-[45%] relative group overflow-hidden border-b border-white/20">
                            <Image
                                src="/images/gallery-mystery-box.jpeg"
                                alt="Unboxing the Blue Magic"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                <p className="text-white font-bold text-xl drop-shadow-md">Zen Unboxing 📦</p>
                            </div>
                        </div>

                        {/* Bottom Right: 2x2 Mini Grid */}
                        <div className="h-[400px] md:h-[55%] grid grid-cols-2 grid-rows-2 gap-0">
                            {/* Stationary */}
                            <div className="relative group overflow-hidden border-r border-b border-white/20">
                                <Image
                                    src="/images/right1.jpeg"
                                    alt="Aesthetic Stationary"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Jewelry */}
                            <div className="relative group overflow-hidden border-b border-white/20">
                                <Image
                                    src="/images/right2.jpeg"
                                    alt="Premium Jewelry"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Hairclips */}
                            <div className="relative group overflow-hidden border-r border-white/20">
                                <Image
                                    src="/images/right3.jpeg"
                                    alt="Ribbon Hairclips"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Hand Creams replaced with Candy choice */}
                            <div className="relative group overflow-hidden">
                                <Image
                                    src="/images/right4.jpeg"
                                    alt="Colorful Candy Choice"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
                                    <p className="text-white font-bold text-sm drop-shadow-md text-center">Sugar Rush 🍬</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
