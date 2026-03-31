"use client";

import MysteryBuilder from "@/components/MysteryBuilder";

// Configuration Options for Mystery Jar
const JAR_SIZES = [
    { id: "small-jar", name: "Small Jar", weight: "Sweet Treats", price: 600, image_url: "/images/candy-jar.png" },
    { id: "medium-jar", name: "Medium Jar", weight: "Sweet Treats", price: 1100, image_url: "/images/candy-jar.png" },
    { id: "large-jar", name: "Large Jar", weight: "Sweet Treats", price: 1800, image_url: "/images/candy-jar.png" },
];

const MYSTERY_JAR_ITEMS = [
    "Hard Candy",
    "Gummy Candy",
    "Chewy Candy",
    "Caramel Candy",
    "Chocolate",
    "Jelly",
    "Marshmallow",
    "Sour Candy",
    "Mint",
    "Coffee Candy",
    "Lollipop",
    "Peanuts",
    "Popcorns"
];

const COLOR_THEMES = [
    { id: "gummy-glaze", name: "Gummy Glaze (Chewy & Hard)", emoji: "🍬", bgRaw: "bg-gradient-to-br from-blue-100 to-cyan-200", activeClass: "border-blue-400 ring-blue-200" },
    { id: "wobble-clouds", name: "Wobble Clouds (Jelly)", emoji: "🧸", bgRaw: "bg-gradient-to-br from-pink-100 to-rose-200", activeClass: "border-pink-400 ring-pink-200" },
    { id: "choco-comet", name: "Choco-Comet (Chocolate)", emoji: "🍫", bgRaw: "bg-gradient-to-br from-[#7B3F00]/10 to-[#3e2723]/20", activeClass: "border-amber-800 ring-amber-100" },
    { id: "confectionary", name: "The Confectionary Cloud (Mix)", emoji: "🍭", bgRaw: "bg-gradient-to-br from-purple-100 to-indigo-200", activeClass: "border-purple-400 ring-purple-200" },
];

const CATEGORY_PREFS = [
    { id: "sugar-cube", name: "Sugar Cube", emoji: "🧊" },
    { id: "cotton-candy-cup", name: "Cotton Candy Cup", emoji: "🍭" },
    { id: "candy-cloud-buffet", name: "Candy Cloud Buffet", emoji: "☁️" },
];

export default function MysteryJarPage() {
    return (
        <div className="bg-[#fdf6ec] min-h-screen pt-24 pb-12">
            <MysteryBuilder
                title="Mystery Jar"
                description={
                    <>
                        You choose the vibe, we pack the surprise! Build your <span className="text-pink font-extrabold">Candy-Coated Wonderland</span>.
                    </>
                }
                categories={CATEGORY_PREFS}
                sizes={JAR_SIZES}
                themes={COLOR_THEMES}
                itemsList={MYSTERY_JAR_ITEMS}
                listTitle="Items in Mystery Jar"
                categoryStepLabel="Choose Category Preference"
                sizeStepLabel="Choose your Size"
                themeStepLabel="Pick a Color Theme"
                productIdPrefix="mystery-jar"
                productType="Mystery Jar"
            />
        </div>
    );
}
