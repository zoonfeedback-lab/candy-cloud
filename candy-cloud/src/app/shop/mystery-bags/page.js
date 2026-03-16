"use client";

import MysteryBuilder from "@/components/MysteryBuilder";

// Configuration Options for Jewelry Mystery Bags
const BAG_SIZES = [
    { id: "3-bags", name: "3 Bags", weight: "Jewelry", price: 1500, emoji: "🛍️" },
    { id: "5-bags", name: "5 Bags", weight: "Jewelry", price: 2300, emoji: "🛍️" },
    { id: "7-bags", name: "7 Bags", weight: "Jewelry", price: 3000, emoji: "🛍️" },
];

const JEWELRY_ITEMS = [
    "Hair Pins", 
    "Brooches", 
    "Studs", 
    "Jhumkas", 
    "Hoops", 
    "Dangles", 
    "Ear cuffs", 
    "Pendant", 
    "Bangles", 
    "Bracelet", 
    "Rings", 
    "Anklet", 
    "Watches"
];

const FINISHING_THEMES = [
    { id: "moonlit", name: "Moonlit Mist (Silver)", emoji: "🌌", bgRaw: "bg-gradient-to-br from-gray-100 to-slate-200", activeClass: "border-slate-400 ring-slate-200" },
    { id: "golden", name: "Golden Hour (Golden)", emoji: "🌅", bgRaw: "bg-gradient-to-br from-yellow-100 to-orange-100", activeClass: "border-yellow-400 ring-yellow-200" },
    { id: "cosmic", name: "Cosmic Candy (Rhinestones)", emoji: "💎", bgRaw: "bg-gradient-to-br from-pink-100 to-purple-200", activeClass: "border-purple-400 ring-purple-200" },
    { id: "twilight", name: "The Twilight Tumble (Mix)", emoji: "✨", bgRaw: "bg-gradient-to-br from-indigo-100 to-fuchsia-100", activeClass: "border-fuchsia-400 ring-fuchsia-200" },
];

const CATEGORY_PREFS = [
    { id: "sugar-sparkle", name: "Sugar Sparkle", emoji: "✨" },
    { id: "silver-lining", name: "Silver Lining", emoji: "🌫️" },
    { id: "golden-sunset", name: "Golden Sunset", emoji: "🌅" },
];

export default function MysteryBagsPage() {
    return (
        <div className="bg-[#fdf6ec] min-h-screen pt-24 pb-12">
            <MysteryBuilder
                title="Mystery Bags 💍"
                description={
                    <>
                        You choose the vibe, we pack the surprise! Build your <span className="text-pink font-extrabold">Ultimate Jewelry Haul</span>.
                    </>
                }
                categories={CATEGORY_PREFS}
                sizes={BAG_SIZES}
                themes={FINISHING_THEMES}
                itemsList={JEWELRY_ITEMS}
                listTitle="Items in Mystery Bags"
                categoryStepLabel="Choose Category Preference"
                sizeStepLabel="Choose your Size"
                themeStepLabel="Pick a Finishing Theme"
                productIdPrefix="mystery-jewelry-bag"
                productType="Mystery Bag"
            />
        </div>
    );
}
