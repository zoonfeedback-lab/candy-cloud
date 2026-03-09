import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative mt-16">
            {/* Cloud-bumps top decoration */}
            <div className="relative h-[200px] md:h-[260px] overflow-hidden bg-transparent" style={{ marginBottom: '-2px' }}>
                {/* Background teal layer - back clouds */}
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
                    <ellipse cx="120" cy="280" rx="200" ry="160" fill="#4f9b9b" />
                    <ellipse cx="420" cy="260" rx="240" ry="180" fill="#4f9b9b" />
                    <ellipse cx="780" cy="270" rx="220" ry="170" fill="#4f9b9b" />
                    <ellipse cx="1050" cy="250" rx="250" ry="190" fill="#4f9b9b" />
                    <ellipse cx="1350" cy="265" rx="220" ry="175" fill="#4f9b9b" />
                    <rect x="0" y="280" width="1440" height="40" fill="#4f9b9b" />
                </svg>

                {/* Pink clouds layer - front */}
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
                    <ellipse cx="0" cy="290" rx="180" ry="140" fill="#f9a8d4" />
                    <ellipse cx="270" cy="275" rx="210" ry="165" fill="#f9a8d4" />
                    <ellipse cx="600" cy="260" rx="230" ry="175" fill="#f9a8d4" />
                    <ellipse cx="900" cy="280" rx="200" ry="155" fill="#f9a8d4" />
                    <ellipse cx="1180" cy="265" rx="230" ry="170" fill="#f9a8d4" />
                    <ellipse cx="1440" cy="285" rx="190" ry="150" fill="#f9a8d4" />
                </svg>

                {/* Foreground teal clouds - overlap on top of pink */}
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
                    <ellipse cx="180" cy="300" rx="230" ry="150" fill="#4f9b9b" />
                    <ellipse cx="540" cy="295" rx="200" ry="145" fill="#4f9b9b" />
                    <ellipse cx="850" cy="305" rx="180" ry="135" fill="#4f9b9b" />
                    <ellipse cx="1200" cy="298" rx="220" ry="148" fill="#4f9b9b" />
                    <rect x="0" y="300" width="1440" height="20" fill="#4f9b9b" />
                </svg>
            </div>

            {/* Main */}
            <div className="pt-16 pb-12 relative overflow-hidden bg-gradient-to-b from-[#4f9b9b] to-[#3b8a8a]">
                {/* Subtle Floating Background Elements */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden hidden md:block opacity-40">
                    <span className="absolute top-10 left-[10%] text-white text-xl animate-bounce flex items-center justify-center">☁️</span>
                    <span className="absolute top-1/4 right-[20%] text-white text-sm animate-pulse2 flex items-center justify-center">✨</span>
                    <span className="absolute bottom-1/4 left-[30%] text-white text-lg animate-bounce flex items-center justify-center delay-500">🤍</span>
                    <span className="absolute top-1/2 right-[15%] text-white text-2xl animate-pulse flex items-center justify-center delay-700">✨</span>
                </div>

                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] gap-12 relative z-10">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <a href="/" className="inline-block relative w-[160px] h-14">
                            <Image
                                src="/images/logo.png"
                                alt="CandyCloud"
                                fill
                                sizes="160px"
                                className="object-contain hover:scale-105 transition-transform"
                            />
                        </a>
                        <p className="text-sm text-white/90 leading-relaxed font-medium mt-1 pr-6">
                            204 - A Link Arcade, PMA Link Road<br />Abbottabad, Pakistan
                        </p>
                        <div className="flex items-center gap-3 text-sm text-white/90 font-medium">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm">📞</span>
                            <span>03100110014</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/90 font-medium">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm">✉️</span>
                            <span>info@candycloud.pk</span>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xl font-extrabold text-white mb-2 tracking-wide">Explore</h4>
                        <ul className="flex flex-col gap-3">
                            {["Contact Us", "About Us", "Track Order", "Shipping & Returns", "Refund Policy"].map((l) => (
                                <li key={l}><a href={l === "Track Order" ? "/track" : "#"} className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 flex items-center transition-all">
                                    <span className="opacity-0 -ml-3 mr-1 transition-all">→</span>{l}
                                </a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xl font-extrabold text-white mb-2 tracking-wide">Support</h4>
                        <ul className="flex flex-col gap-3 mb-4">
                            {["Orders", "Addresses", "Account Details", "24x7 Whatsapp", "FAQ"].map((l) => (
                                <li key={l}><a href="#" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 flex items-center transition-all">
                                    <span className="opacity-0 -ml-3 mr-1 transition-all">→</span>{l}
                                </a></li>
                            ))}
                        </ul>

                        <div className="flex gap-4 mt-2">
                            <a href="#" aria-label="Instagram" className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border-2 border-white/20 text-white backdrop-blur-sm hover:bg-gradient-to-tr hover:from-pink-500 hover:to-purple-500 hover:border-transparent hover:-translate-y-1.5 hover:scale-110 hover:shadow-[0_8px_20px_rgba(236,72,153,0.4)] transition-all duration-300">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <circle cx="12" cy="12" r="5" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                                </svg>
                            </a>
                            <a href="#" aria-label="TikTok" className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border-2 border-white/20 text-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 hover:border-transparent hover:-translate-y-1.5 hover:scale-110 hover:shadow-[0_8px_20px_rgba(236,72,153,0.4)] transition-all duration-300">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.51a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.24 8.24 0 0 0 3.76.92V6.16a4.84 4.84 0 0 1-.01.53z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xl font-extrabold text-white tracking-wide">Stay Sweet</h4>
                        <p className="text-sm font-medium text-white/80 leading-relaxed">
                            Be the first to know about new drops and get <span className="text-pink-300 font-bold">15% off</span> your first order!
                        </p>
                        <div className="flex items-center bg-white/15 backdrop-blur-md rounded-2xl border-2 border-white/20 overflow-hidden mt-2 focus-within:border-pink-300 focus-within:bg-white/25 transition-all">
                            <input
                                type="email"
                                placeholder="Email address..."
                                className="flex-1 py-3.5 px-4 bg-transparent text-sm font-bold text-white placeholder:text-white/60 outline-none"
                            />
                            <button className="bg-transparent px-4 py-2 text-pink-300 hover:scale-110 transition-transform" aria-label="Subscribe">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pink wave bottom */}
            <div className="h-[30px] relative mt-[-1px]">
                <div className="absolute inset-0 bg-[#3b8a8a]"></div>
                <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full block absolute top-0 left-0 z-10">
                    <defs>
                        <linearGradient id="wave-gradient-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f9a8d4" />
                            <stop offset="100%" stopColor="#f472b6" />
                        </linearGradient>
                    </defs>
                    <path d="M0,0 C480,60 960,0 1440,40 L1440,60 L0,60 Z" fill="url(#wave-gradient-bottom)" />
                </svg>
            </div>
        </footer>
    );
}
