"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Scoop", href: "/scoop" },
    { label: "Shop", href: "/shop" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { totalItems: totalCartItems, isLoaded: cartLoaded, clearLocalCart } = useCart();
    const { totalItems: totalWishlistItems, isLoaded: wishlistLoaded } = useWishlist();
    const { user, isAuthenticated, logout, openAuthModal } = useAuth();

    // Prevent hydration mismatch for client-rendered bubble cart
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="relative z-50 bg-white shadow-sm border-b border-gray-50">
            <div className="max-w-[1200px] mx-auto px-5 py-3 md:py-4 flex flex-col items-stretch justify-center">
                {/* Top Row: Left Icons / Center Logo / Right Auth */}
                <div className="flex items-center justify-between w-full">

                    {/* Left: Wishlist, Cart (Desktop) & Hamburger (Mobile) */}
                    <div className="flex-1 flex items-center justify-start gap-4 z-50">
                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden bg-gray-50 rounded-lg p-2 flex items-center justify-center text-dark hover:bg-gray-100 transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            )}
                        </button>

                        {/* Desktop Icons */}
                        <div className="hidden md:flex items-center gap-4">
                            <a href="/wishlist" className="flex items-center justify-center transition-all hover:-translate-y-1 hover:scale-110 drop-shadow-sm hover:drop-shadow-md relative" aria-label="Wishlist">
                                {mounted && wishlistLoaded && totalWishlistItems > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-pink text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md z-10 px-1 transition-transform animate-pulse2">
                                        {totalWishlistItems > 99 ? '99+' : totalWishlistItems}
                                    </span>
                                )}
                                <Image src="/images/cute-heart.png" alt="Wishlist" width={36} height={36} className="w-[36px] h-[36px] object-contain" />
                            </a>
                            <a href="/cart" className="flex items-center justify-center transition-all hover:-translate-y-1 hover:scale-110 drop-shadow-sm hover:drop-shadow-md relative" aria-label="Cart">
                                {mounted && cartLoaded && totalCartItems > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-pink text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md z-10 px-1 transition-transform animate-pulse2">
                                        {totalCartItems > 99 ? '99+' : totalCartItems}
                                    </span>
                                )}
                                <Image src="/images/cute-cart.png" alt="Cart" width={36} height={36} className="w-[36px] h-[36px] object-contain" />
                            </a>
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-shrink-0 z-50 flex justify-center items-center">
                        <a href="/" className="block relative">
                            <Image
                                src="/images/logo.png"
                                alt="CandyCloud"
                                width={250}
                                height={83}
                                priority
                                className="w-[150px] md:w-[200px] h-auto object-contain transition-transform hover:scale-105"
                            />
                        </a>
                    </div>

                    {/* Right: Auth Section (Desktop) & Mobile Cart */}
                    <div className="flex-1 flex items-center justify-end gap-3 z-50">
                        {/* Mobile Cart */}
                        <div className="md:hidden flex items-center gap-4">
                            <a href="/cart" className="relative" aria-label="Cart">
                                {mounted && cartLoaded && totalCartItems > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 px-0.5">
                                        {totalCartItems > 99 ? '99+' : totalCartItems}
                                    </span>
                                )}
                                <Image src="/images/cute-cart.png" alt="Cart" width={30} height={30} className="w-[30px] h-[30px] object-contain" />
                            </a>
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {mounted && isAuthenticated ? (
                                <>
                                    <a href="/orders" className="text-xs font-bold text-gray-500 hover:text-pink-500 transition-colors">Orders</a>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-700">Hi, {user?.name?.split(' ')[0]}</span>
                                        <button
                                            onClick={() => { logout(); clearLocalCart(); }}
                                            className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => openAuthModal('login')} className="px-4 py-2 rounded-2xl text-sm font-bold text-gray-600 hover:text-pink-500 hover:bg-pink-50/50 transition-all">
                                        Sign In
                                    </button>
                                    <button onClick={() => openAuthModal('register')} className="px-4 py-2 rounded-2xl bg-pink-500 text-white text-sm font-bold hover:bg-pink-600 hover:-translate-y-0.5 transition-all shadow-sm">
                                        Join
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Row (Desktop): Navigation */}
                <nav className="hidden md:block mt-4 w-full">
                    <ul className="flex items-center justify-center gap-6">
                        {navItems.map((item) => (
                            <li
                                key={item.label}
                                className="relative group"
                                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                                onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                            >
                                <a
                                    href={item.href}
                                    className={`
                                        px-5 py-2 text-sm font-bold rounded-2xl transition-all inline-flex items-center gap-1 relative overflow-hidden
                                        ${pathname === item.href
                                            ? "text-pink bg-pink-50/80 shadow-[0_2px_10px_rgba(244,114,182,0.15)] scale-[1.02]"
                                            : "text-gray-600 hover:text-pink hover:bg-pink-50/50 hover:scale-[1.02]"
                                        }
                                    `}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <nav className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-40 max-h-[80vh] overflow-y-auto animate-slideDown">
                    <ul className="flex flex-col px-6 py-2">
                        {navItems.map((item) => (
                            <li key={item.label} className="border-b border-gray-50 last:border-none">
                                <a
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center justify-between py-4 text-base font-bold transition-colors ${pathname === item.href ? 'text-pink bg-pink-50/30 px-3 rounded-lg -mx-3 my-1' : 'text-gray-700 hover:text-pink'}`}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Auth */}
                    <div className="px-6 py-4 border-t border-gray-100">
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold text-pink-500">{user?.name?.charAt(0)}</div>
                                    <span className="text-sm font-bold text-gray-700">{user?.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <a href="/orders" onClick={() => setMenuOpen(false)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">Orders</a>
                                    <button onClick={() => { logout(); clearLocalCart(); setMenuOpen(false); }} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => { setMenuOpen(false); openAuthModal('login'); }} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold text-center">Sign In</button>
                                <button onClick={() => { setMenuOpen(false); openAuthModal('register'); }} className="flex-1 py-3 rounded-xl bg-pink-500 text-white text-sm font-bold text-center">Join</button>
                            </div>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
