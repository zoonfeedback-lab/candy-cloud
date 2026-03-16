"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist, isLoaded } = useWishlist();
    const { isAuthenticated, openAuthModal } = useAuth();

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center py-40">
                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white text-[#2a2a2a]">
                <Navbar />
                <div className="max-w-[1200px] mx-auto px-5 py-24 text-center">
                    <div className="mb-8 text-7xl">🔒</div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Join the Magic!</h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-md mx-auto font-medium">
                        Please sign in to view and manage your magical wishlist collection.
                    </p>
                    <button 
                        onClick={() => openAuthModal('login')}
                        className="px-10 py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:-translate-y-1"
                    >
                        Sign In Now
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-[#2a2a2a]">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-5 py-20">
                <div className="text-center mb-16 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 inline-block">
                        YOUR WISHLIST
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        Your curated collection of magical surprises
                    </p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-24 bg-gradient-to-b from-gray-50 to-white rounded-[40px] border-2 border-dashed border-pink-100 max-w-2xl mx-auto px-10">
                        <div className="mb-8 text-8xl animate-bounce">💭</div>
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-800">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-10 text-lg">
                            Looks like you haven't saved any treasures yet! Start exploring our shop to find something magical.
                        </p>
                        <Link href="/shop" className="inline-block px-10 py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg hover:-translate-y-1">
                            Go Shopping 🍬
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {wishlistItems.map((item) => (
                            <div key={item.productId} className="group relative bg-white rounded-[32px] p-8 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(236,72,153,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                                {/* Decorative Blobs */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-50 rounded-full opacity-50 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-50 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                                
                                <button 
                                    onClick={() => removeFromWishlist(item.productId)}
                                    className="absolute top-6 right-6 p-2.5 bg-white/80 backdrop-blur-md text-gray-300 hover:text-red-500 rounded-full shadow-sm hover:shadow-md transition-all z-10 border border-gray-100"
                                    aria-label="Remove from wishlist"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="text-6xl mb-8 bg-gradient-to-br from-pink-50 to-purple-50 w-24 h-24 rounded-3xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-inner">
                                        {item.emoji || "🎁"}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                                            <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em]">
                                                {item.type || "Product"}
                                            </p>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black mb-4 leading-tight text-gray-800">
                                            {item.name}
                                        </h3>
                                        
                                        <p className="text-gray-500 text-sm mb-10 leading-relaxed line-clamp-2 font-medium">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link 
                                            href={item.type === 'category' ? `/shop/${item.productId}` : (item.type === 'mystery' ? '/scoop' : `/shop` )}
                                            className="flex-1 px-6 py-4 bg-gray-900 text-white text-center rounded-2xl font-bold text-sm hover:bg-pink-500 transition-all shadow-md hover:shadow-pink-200 active:scale-95"
                                        >
                                            View Magic
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
