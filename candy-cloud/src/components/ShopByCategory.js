"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, getItemEmoji } from "@/data/products";

const catKeys = Object.keys(categories);
// Append 'All' to the front
const ALL_KEY = "All 🌟";
const tabs = [ALL_KEY, ...catKeys];

export default function ShopByCategory() {
    const [activeTab, setActiveTab] = useState(ALL_KEY);
    const [searchQuery, setSearchQuery] = useState("");
    const active = activeTab === ALL_KEY ? null : categories[activeTab];
    // Generate comprehensive items list for "All" tab
    const allCategoryItems = catKeys.flatMap(cat =>
        categories[cat].items.map(item => ({
            name: item,
            category: cat,
            ...categories[cat] // Spread bgLight, emoji, color
        }))
    );

    // If "All" is active, use allCategoryItems, else use the specific category's string array and enrich it
    const currentList = activeTab === ALL_KEY
        ? allCategoryItems
        : active.items.map(item => ({
            name: item,
            category: activeTab,
            ...active
        }));

    // Filter items based on search
    const filteredItems = searchQuery.trim()
        ? currentList.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : currentList;

    // Cross-category search results summary (only matters if finding things OUTSIDE active tab)
    const allResults = searchQuery.trim()
        ? allCategoryItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <section id="categories" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 inline-block">
                        Shop 🍭
                    </h2>
                    <p className="text-lg text-gray-500 max-w-[600px] mx-auto font-medium">
                        Explore our curated collections — there&apos;s something magical for everyone!
                    </p>
                </div>

                {/* Search Bar */}
                {/* <div className="max-w-[500px] mx-auto mb-10">
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products... (e.g. Lip Gloss, Earrings, Planner)"
                            className="w-full pl-12 pr-10 py-4 bg-white border-2 border-pink-100 focus:border-pink-300 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-pink-50 transition-all text-gray-700 placeholder:text-gray-400 font-medium shadow-sm"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-xs text-gray-400 mt-2 text-center font-medium">
                            Found <span className="text-pink-500 font-bold">{allResults.length}</span> result{allResults.length !== 1 ? 's' : ''} across all categories
                        </p>
                    )}
                </div> */}

                {/* Tab Buttons */}
                {/* <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {tabs.map((name) => {
                        const isActive = activeTab === name;
                        const tabEmoji = name === ALL_KEY ? "" : categories[name].emoji + " ";
                        const tabColor = name === ALL_KEY
                            ? "from-pink-400 to-purple-500"
                            : categories[name].color;

                        return (
                            <button
                                key={name}
                                onClick={() => setActiveTab(name)}
                                className={`
                                    px-8 py-3.5 rounded-full text-base font-bold transition-all duration-300
                                    ${isActive
                                        ? `bg-gradient-to-r ${tabColor} text-white shadow-[0_8px_25px_rgba(244,114,182,0.4)] scale-105`
                                        : "bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:scale-105 hover:shadow-md"
                                    }
                                `}
                            >
                                <span className="mr-2 text-xl">{tabEmoji}</span>
                                {name.replace(" 🌟", "")}
                            </button>
                        );
                    })}
                </div> */}

                {/* Active Category Container */}
                <div className={`relative rounded-[30px] p-8 md:p-12 transition-all duration-500 shadow-sm border border-white/50 bg-gradient-to-b ${activeTab === ALL_KEY ? 'from-[#f3efff] to-[#ffeaf5]' : 'from-[#ffe3ef] to-[#ffd3e6]'} overflow-hidden`}>

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-10 left-10 text-3xl animate-bounce opacity-70 blur-[1px]">☁️</div>
                    <div className="absolute top-20 right-20 text-2xl animate-pulse2 opacity-80">⭐</div>
                    <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce delay-1000 opacity-60">🍬</div>
                    <div className="absolute top-1/2 right-10 text-xl animate-pulse opacity-90 blur-[1px]">✨</div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-sm">
                                    <span className="text-3xl">{activeTab === ALL_KEY ? "🌟" : active.emoji}</span>
                                </div>
                                <h3 className="text-3xl font-extrabold text-gray-800">{activeTab}</h3>
                            </div>
                            <span className="px-4 py-1.5 bg-white/70 rounded-full text-sm font-bold text-pink-600 shadow-sm backdrop-blur-sm">
                                {filteredItems.length} {searchQuery ? 'found' : 'magical items'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                            {filteredItems.length > 0 ? filteredItems.map((itemObj, idx) => {
                                const slug = itemObj.name.toLowerCase().replace(/\s+/g, '-');
                                return (
                                    <Link
                                        href={`/shop/${slug}`}
                                        key={itemObj.name + idx}
                                        className={`
                                            bg-white rounded-[20px] p-5 text-center transition-all duration-200 cursor-pointer group relative
                                            shadow-[0_6px_18px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_25px_rgba(236,72,153,0.15)] hover:-translate-y-[6px]
                                        `}
                                    >
                                        {/* Tooltip for category context on All tab */}
                                        {activeTab === ALL_KEY && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
                                                {itemObj.category} {itemObj.emoji}
                                            </div>
                                        )}
                                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${itemObj.bgLight}`}>
                                            <span className="text-[32px]">
                                                {getItemEmoji(itemObj.name)}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-pink-600 transition-colors">
                                            {itemObj.name}
                                        </span>
                                    </Link>
                                );
                            }) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-4xl mb-3 opacity-60">🔍</div>
                                    <p className="text-gray-500 font-medium">No items found for "{searchQuery}" in {activeTab}</p>
                                    <p className="text-xs text-gray-400 mt-1">Try a different category or clear the search</p>
                                </div>
                            )}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-[30px] bg-gradient-to-r from-[#ff6fae] to-[#ff3c8e] text-white font-bold text-base hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,60,142,0.4)] transition-all duration-300"
                            >
                                {activeTab === ALL_KEY ? "Shop The Full Candy Cloud Collection ✨" : `Shop ${activeTab} Collection →`}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
