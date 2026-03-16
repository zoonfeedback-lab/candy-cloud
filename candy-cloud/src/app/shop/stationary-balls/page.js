"use client";

import MysteryBuilder from "@/components/MysteryBuilder";

// Configuration Options for Stationary Balls
const SCOOP_SIZES = [
    { id: "mini", name: "Mini Scoop", weight: "5 balls", price: 500, emoji: "🥄" },
    { id: "mega", name: "Mega Scoop", weight: "7 balls", price: 900, emoji: "🥣" },
    { id: "ultimate", name: "Ultimate Scoop", weight: "10 balls", price: 1600, emoji: "🛍️" },
];

const STATIONARY_ITEMS = [
    "Stickers",
    "Washi tape",
    "Erasers",
    "Bookmarks",
    "Pens",
    "Pencils",
    "Sharpener",
    "Scale",
    "Mini notebooks",
    "Sticky notes",
    "Highlighter",
    "Marker",
    "Memopads",
    "Planners",
    "Journals",
    "Notebook",
    "Multi color pens",
    "Pouch"
];

const COLOR_THEMES = [
    { id: "strawberry", name: "Strawberry Sky (Pink)", emoji: "🍓", bgRaw: "bg-gradient-to-br from-pink-200 to-rose-200", activeClass: "border-pink-400 ring-pink-200" },
    { id: "berry", name: "Berry Blizzard (Blue)", emoji: "🫐", bgRaw: "bg-gradient-to-br from-blue-200 to-indigo-200", activeClass: "border-blue-400 ring-blue-200" },
    { id: "lavender", name: "Lavender Lullaby (Purple)", emoji: "🧁", bgRaw: "bg-gradient-to-br from-purple-200 to-fuchsia-200", activeClass: "border-purple-400 ring-purple-200" },
    { id: "marshmallow", name: "Marshmallow Mist (White)", emoji: "☁️", bgRaw: "bg-gradient-to-br from-gray-50 to-slate-100", activeClass: "border-slate-300 ring-slate-100" },
    { id: "lemonade", name: "Lemonade Ray (Yellow)", emoji: "🍋", bgRaw: "bg-gradient-to-br from-yellow-100 to-amber-100", activeClass: "border-yellow-400 ring-yellow-200" },
    { id: "apricot", name: "Apricot Afterglow (Orange)", emoji: "🍑", bgRaw: "bg-gradient-to-br from-orange-200 to-amber-200", activeClass: "border-orange-400 ring-orange-200" },
    { id: "minty", name: "Minty Meadow (Green)", emoji: "🍃", bgRaw: "bg-gradient-to-br from-emerald-100 to-teal-100", activeClass: "border-emerald-400 ring-emerald-200" },
    { id: "midnight", name: "Midnight Cocoa (Black)", emoji: "☕", bgRaw: "bg-gradient-to-br from-stone-400 to-neutral-500 text-white", activeClass: "border-stone-600 ring-stone-400" },
    { id: "caramel", name: "Caramel Cloud (Brown)", emoji: "🍮", bgRaw: "bg-gradient-to-br from-amber-700 to-orange-900 text-white", activeClass: "border-amber-800 ring-amber-600" },
    { id: "cherry", name: "Cherry Cosmos (Red)", emoji: "🍒", bgRaw: "bg-gradient-to-br from-red-400 to-rose-600 text-white", activeClass: "border-red-500 ring-red-300" },
];

const CATEGORY_PREFS = [
    { id: "mini-mist", name: "Mini Mist", emoji: "💨" },
    { id: "overcast-hail", name: "Overcast Hail", emoji: "🌧️" },
    { id: "storm-of-inspiration", name: "Storm of Inspiration", emoji: "⛈️" },
];

export default function StationaryBallsPage() {
    return (
        <div className="bg-[#fdf6ec] min-h-screen pt-24 pb-12">
            <MysteryBuilder
                title="Stationary Balls 🔮"
                description={
                    <>
                        You choose the vibe, we pack the surprise! Build your <span className="text-pink font-extrabold">tiny Capsule Of Magic</span>.
                    </>
                }
                categories={CATEGORY_PREFS}
                sizes={SCOOP_SIZES}
                themes={COLOR_THEMES}
                itemsList={STATIONARY_ITEMS}
                listTitle="Items in Stationary Balls"
                categoryStepLabel="Choose Category Preference"
                sizeStepLabel="Choose your Size"
                themeStepLabel="Pick a Color Theme"
                productIdPrefix="stationary-ball"
                productType="Stationary Ball"
            />
        </div>
    );
}
