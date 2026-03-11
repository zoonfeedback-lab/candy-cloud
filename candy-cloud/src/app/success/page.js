import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Success from "@/components/Success";

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Navbar />

            {/* Top Wavy Decorator */}
            <div className="relative h-12 w-full overflow-hidden bg-white">
                <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full block">
                    <path d="M0,48 C480,0 960,96 1440,48 L1440,0 L0,0 Z" fill="#fce7f3" />
                </svg>
            </div>

            <main className="flex-1">
                <Success />
            </main>

            {/* Bottom Wavy Decorator */}
            <div className="relative h-16 w-full overflow-hidden bg-white mt-auto">
                <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="absolute top-0 w-full h-full block">
                    <path d="M0,0 C480,64 960,-16 1440,24 L1440,64 L0,64 Z" fill="#fdf2f8" />
                </svg>
            </div>

            <Footer />
        </div>
    );
}
