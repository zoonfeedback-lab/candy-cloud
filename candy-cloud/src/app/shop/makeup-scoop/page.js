"use client";

import MysteryBuilder from "@/components/MysteryBuilder";

// Configuration Options for Makeup Scoop
const SCOOP_SIZES = [
    { id: "mini", name: "Mini Scoop", price: 1500, emoji: "🥄" },
    { id: "mega", name: "Mega Scoop", price: 3000, emoji: "🥣" },
    { id: "ultimate", name: "Ultimate Scoop", price: 5000, emoji: "🛍️" },
];

const MAKEUP_ITEMS = [
    "Hand Cream",
    "Nail Paint",
    "Highlighter",
    "Blush",
    "Bronzer",
    "Eyeshadow",
    "EyeLiner",
    "Mascara",
    "Eye Lashes",
    "Kajal",
    "Lipstick",
    "Lip Liner",
    "Lip Gloss",
    "Lip balm",
    "Tweessors",
    "Curler",
    "Brushes",
    "Sponges",
    "Nails",
    "Wipes",
    "Nail Files",
    "Masks"
];

const COLOR_THEMES = [
    { id: "lips", name: "Glazed Nebula (only lip products)", emoji: "👄", bgRaw: "bg-gradient-to-br from-pink-100 to-rose-200", activeClass: "border-pink-400 ring-pink-200" },
    { id: "eyes", name: "Pastel Aurora (only eye products)", emoji: "👁️", bgRaw: "bg-gradient-to-br from-purple-100 to-indigo-200", activeClass: "border-purple-400 ring-purple-200" },
    { id: "face", name: "Blushing Breeze (only face products)", emoji: "🧴", bgRaw: "bg-gradient-to-br from-orange-50 to-orange-100", activeClass: "border-orange-300 ring-orange-100" },
    { id: "all", name: "Candy-Coated Canvas (All Products)", emoji: "💄", bgRaw: "bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100", activeClass: "border-pink-400 ring-pink-200" },
];

const CATEGORY_PREFS = [
    { id: "sugar-pop", name: "Sugar Pop", emoji: "🍒" },
    { id: "cotton-candy-glow", name: "Cotton Candy Glow", emoji: "🪞" },
    { id: "sky-high-glam", name: "Sky High Glam", emoji: "💄" },
];

export default function MakeupScoopPage() {
    return (
        <div className="bg-[#fdf6ec] min-h-screen pt-24 pb-12">
            <MysteryBuilder
                title="Makeup Scoop 💄"
                description={
                    <>
                        You choose the vibe, we pack the surprise! Build your <span className="text-pink font-extrabold">Glowup Scoop</span>.
                    </>
                }
                categories={CATEGORY_PREFS}
                sizes={SCOOP_SIZES}
                themes={COLOR_THEMES}
                itemsList={MAKEUP_ITEMS}
                listTitle="Items in Makeup Scoop"
                categoryStepLabel="Choose Category Preference"
                sizeStepLabel="Choose your Size"
                themeStepLabel="Pick A Product Theme"
                productIdPrefix="makeup-scoop"
                productType="Makeup Scoop"
            />
        </div>
    );
}
