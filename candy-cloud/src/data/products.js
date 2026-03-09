export const categories = {
    "Sweet Treat": {
        emoji: "🍬",
        color: "from-pink to-pink-dark",
        bgLight: "bg-pink-50",
        borderColor: "border-pink-200",
        items: [
            "Stickers", "Washi Tape", "Erasers", "Hair Ties", "Paper Soap",
            "Bookmarks", "Pens", "Pencils", "Sharpener", "Scale",
            "Key Chain", "Phone Ring", "Lip Balm", "Nail File", "Mini Wipes",
            "Hair Clips", "Scrunchies",
        ],
    },
    "Dreamy Delight": {
        emoji: "✨",
        color: "from-purple-400 to-pink",
        bgLight: "bg-purple-50",
        borderColor: "border-purple-200",
        items: [
            "Lip Gloss", "Face Masks", "Hand Cream", "Hair Claws", "Earrings",
            "Rings", "Hair Band", "Popsockets", "Mini Notebooks", "Sticky Notes",
            "Highlighter", "Marker", "Memopads", "Card Holder", "Coin Purse",
            "Mirror", "Socks", "Phone Charm", "Eye Mask", "Lipliner", "Nail Clipper",
        ],
    },
    "Cloud Nine": {
        emoji: "☁️",
        color: "from-sky-400 to-teal",
        bgLight: "bg-sky-50",
        borderColor: "border-sky-200",
        items: [
            "Planners", "Journals", "Notebook", "Multicolor Pens", "Watches",
            "Necklaces", "Bracelet", "Jewelry Boxes", "Building Blocks",
            "Diamond Painting Kits", "Mystery Box", "Full-Sized Bag", "Pouch",
            "Wallet", "Lipstick", "Eyeliner", "Nails", "Brooch", "Hair Brush",
        ],
    },
};

export function getItemEmoji(item) {
    const map = {
        "Stickers": "🏷️", "Washi Tape": "🎀", "Erasers": "🧹", "Hair Ties": "💇‍♀️",
        "Paper Soap": "🧼", "Bookmarks": "🔖", "Pens": "🖊️", "Pencils": "✏️",
        "Sharpener": "✂️", "Scale": "📏", "Key Chain": "🔑", "Phone Ring": "📱",
        "Lip Balm": "💋", "Nail File": "💅", "Mini Wipes": "🧻", "Hair Clips": "📎",
        "Scrunchies": "🎀", "Lip Gloss": "💄", "Face Masks": "🧖‍♀️", "Hand Cream": "🧴",
        "Hair Claws": "🦀", "Earrings": "💎", "Rings": "💍", "Hair Band": "👑",
        "Popsockets": "📱", "Mini Notebooks": "📒", "Sticky Notes": "📝",
        "Highlighter": "🖍️", "Marker": "🖊️", "Memopads": "🗒️", "Card Holder": "💳",
        "Coin Purse": "👛", "Mirror": "🪞", "Socks": "🧦", "Phone Charm": "✨",
        "Eye Mask": "😴", "Lipliner": "💄", "Nail Clipper": "💅", "Planners": "📅",
        "Journals": "📓", "Notebook": "📔", "Multicolor Pens": "🖊️", "Watches": "⌚",
        "Necklaces": "📿", "Bracelet": "💎", "Jewelry Boxes": "🎁",
        "Building Blocks": "🧱", "Diamond Painting Kits": "🎨", "Mystery Box": "🎁",
        "Full-Sized Bag": "👜", "Pouch": "👝", "Wallet": "👛", "Lipstick": "💄",
        "Eyeliner": "👁️", "Nails": "💅", "Brooch": "🌸", "Hair Brush": "💇‍♀️",
    };
    return map[item] || "🎀";
}

// Helper to find an item's details across all categories
export function getProductData(itemName) {
    const normalizedName = itemName.toLowerCase().replace(/-/g, " ");

    // Find the original true-case name and category
    for (const [catName, catData] of Object.entries(categories)) {
        const foundOriginal = catData.items.find(i => i.toLowerCase() === normalizedName);
        if (foundOriginal) {
            return {
                name: foundOriginal,
                category: catName,
                emoji: getItemEmoji(foundOriginal),
                categoryData: catData
            };
        }
    }

    return null; // Not found
}
