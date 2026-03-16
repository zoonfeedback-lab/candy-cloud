"use client";

import MysteryBuilder from "./MysteryBuilder";

// Configuration Options
const SCOOP_SIZES = [
    { id: "mini", name: "Mini Scoop", weight: "250g", price: 500, emoji: "🥄" },
    { id: "mega", name: "Mega Scoop", weight: "500g", price: 900, emoji: "🥣" },
    { id: "ultimate", name: "Ultimate Scoop", weight: "1kg", price: 1600, emoji: "🛍️" },
];

const SCOOP_ITEMS = [
    "Stickers", "Washi tape", "Erasers", "Hair ties", "Paper soap", "Bookmarks", "Pens", "Pencils", "Sharpener", "Scale", "Nail files", "Mini wipes",
    "Hair clips", "Scrunchies", "Makeup sponges", "Hair claws", "Hair band", "Popsockets", "Mini notebooks", "Sticky notes", "Highlighter", "Marker", "Memopads", "Card holder", "Coin purse", "Mirror", "Socks",
    "Phone charm", "Eye mask", "Lipliner", "Nail clipper", "Key chain", "Phone ring", "Lip balm", "Studs", "Planners", "Journals", "Notebook", "Multi color pens", "Watches", "Necklaces", "Bracelet", "Jewelry boxes", "Building blocks", "Diamond painting kits", "Mystery box", "Full-sized bag", "Pouch", "Wallet", "Lipstick", "Eyeliner", "Nails", "Broach",
    "Hair brush", "Perfume", "Earrings", "Rings", "Lip gloss",
    "Face masks", "Hand cream", "Makeup", "Makeup brushes"
];

const COLOR_THEMES = [
    { id: "rainbow", name: "Rainbow Riot", emoji: "🌈", bgRaw: "bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100", activeClass: "border-pink-400 ring-pink-200" },
    { id: "pink", name: "Pink Princess", emoji: "🎀", bgRaw: "bg-gradient-to-br from-pink-100 to-rose-100", activeClass: "border-pink-500 ring-pink-300" },
    { id: "blue", name: "Blue Lagoon", emoji: "🌊", bgRaw: "bg-gradient-to-br from-blue-100 to-cyan-100", activeClass: "border-blue-400 ring-blue-200" },
    { id: "mystery", name: "Mystery Mix", emoji: "🃏", bgRaw: "bg-gradient-to-br from-purple-100 to-indigo-100", activeClass: "border-purple-400 ring-purple-200" },
];

const CATEGORY_PREFS = [
    { id: "sweet-treat", name: "Sweet Treat", emoji: "🍬" },
    { id: "dreamy-delight", name: "Dreamy Delight", emoji: "☁️" },
    { id: "cloud-nine", name: "Cloud Nine", emoji: "🧁" },
];

export default function Scoop() {
    return (
        <MysteryBuilder
            title="Mystery Scoop 🎁"
            description={
                <>
                    You choose the vibe, we pack the surprise! Build your <span className="text-pink font-extrabold">Mystery Scoop</span>.
                </>
            }
            categories={CATEGORY_PREFS}
            sizes={SCOOP_SIZES}
            themes={COLOR_THEMES}
            itemsList={SCOOP_ITEMS}
            listTitle="Items in Candy Cloud Scoop"
            categoryStepLabel="Choose Category Preference"
            sizeStepLabel="Choose your Size"
            themeStepLabel="Pick a Color Theme"
            productIdPrefix="mystery-scoop"
            productType="Custom Cup"
        />
    );
}
