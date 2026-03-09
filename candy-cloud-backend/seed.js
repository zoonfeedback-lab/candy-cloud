const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const products = [
    // ─── Sweet Treat Category ───
    { name: "Kawaii Sticker Pack", price: 150, category: "sweet-treat", emoji: "🌸", description: "Adorable pastel stickers for journals", stock: 200, rating: 4.9, reviews: 120 },
    { name: "Cherry Blossom Washi Tape", price: 200, category: "sweet-treat", emoji: "🌸", description: "Beautiful floral washi tape roll", stock: 150, rating: 4.8, reviews: 85 },
    { name: "Cloud Eraser Set", price: 120, category: "sweet-treat", emoji: "☁️", description: "Fluffy cloud-shaped erasers", stock: 300, rating: 4.7, reviews: 200 },
    { name: "Rainbow Hair Ties", price: 180, category: "sweet-treat", emoji: "🌈", description: "Colorful elastic hair ties set", stock: 180, rating: 4.6, reviews: 95 },
    { name: "Sakura Paper Soap", price: 100, category: "sweet-treat", emoji: "🧼", description: "Portable cherry blossom paper soap", stock: 250, rating: 4.9, reviews: 150 },
    { name: "Starry Gel Pen Set", price: 250, category: "sweet-treat", emoji: "✨", description: "Glitter gel pens (6 colors)", stock: 120, rating: 4.8, reviews: 210 },
    { name: "Daisy Mechanical Pencil", price: 130, category: "sweet-treat", emoji: "🌼", description: "Cute daisy-topped pencil", stock: 200, rating: 4.5, reviews: 70 },
    { name: "Velvet Scrunchie Set", price: 220, category: "sweet-treat", emoji: "🎀", description: "Soft velvet scrunchies (3 pack)", stock: 160, rating: 4.7, reviews: 130 },

    // ─── Dreamy Delight Category ───
    { name: "Rose Lip Gloss", price: 350, category: "dreamy-delight", emoji: "💄", description: "Shimmery rose-tinted lip gloss", stock: 100, rating: 4.9, reviews: 180 },
    { name: "Honey Face Mask", price: 280, category: "dreamy-delight", emoji: "🍯", description: "Hydrating honey sheet mask", stock: 200, rating: 4.8, reviews: 160 },
    { name: "Pearl Drop Earrings", price: 450, category: "dreamy-delight", emoji: "💎", description: "Elegant faux pearl earrings", stock: 80, rating: 4.9, reviews: 95 },
    { name: "Mini Cloud Notebook", price: 180, category: "dreamy-delight", emoji: "📓", description: "Pocket-sized cloud-cover notebook", stock: 300, rating: 4.6, reviews: 220 },
    { name: "Pastel Sticky Notes", price: 120, category: "dreamy-delight", emoji: "📝", description: "Gradient pastel sticky note set", stock: 250, rating: 4.7, reviews: 170 },
    { name: "Neon Highlighter Set", price: 300, category: "dreamy-delight", emoji: "🖍️", description: "Dual-tip neon highlighters (4 pack)", stock: 140, rating: 4.5, reviews: 110 },
    { name: "Heart Compact Mirror", price: 250, category: "dreamy-delight", emoji: "💗", description: "Heart-shaped folding mirror", stock: 120, rating: 4.8, reviews: 140 },
    { name: "Silk Eye Mask", price: 400, category: "dreamy-delight", emoji: "😴", description: "Lavender-scented silk eye mask", stock: 90, rating: 4.9, reviews: 75 },

    // ─── Cloud Nine Category ───
    { name: "2025 Aesthetic Planner", price: 800, category: "cloud-nine", emoji: "📅", description: "Full-year planner with stickers", stock: 60, rating: 5.0, reviews: 320 },
    { name: "Leather Bound Journal", price: 650, category: "cloud-nine", emoji: "📖", description: "Premium A5 leather journal", stock: 80, rating: 4.9, reviews: 250 },
    { name: "10-Color Pen Set", price: 500, category: "cloud-nine", emoji: "🖊️", description: "Multicolor retractable pen set", stock: 100, rating: 4.8, reviews: 190 },
    { name: "Butterfly Watch", price: 1200, category: "cloud-nine", emoji: "⌚", description: "Delicate butterfly face watch", stock: 40, rating: 4.9, reviews: 85 },
    { name: "Crystal Pendant Necklace", price: 900, category: "cloud-nine", emoji: "💎", description: "Aurora borealis crystal necklace", stock: 50, rating: 5.0, reviews: 120 },
    { name: "Velvet Jewelry Box", price: 750, category: "cloud-nine", emoji: "🎁", description: "Two-tier velvet organizer", stock: 70, rating: 4.7, reviews: 95 },
    { name: "Mystery Surprise Box", price: 1500, category: "cloud-nine", emoji: "🎊", description: "Premium mystery box of curated goodies", stock: 30, rating: 5.0, reviews: 500 },
    { name: "Candy Cloud Tote Bag", price: 600, category: "cloud-nine", emoji: "👜", description: "Canvas tote with CC branding", stock: 100, rating: 4.8, reviews: 170 },

    // ─── Featured Bundles ───
    { name: "Sweet Treat Bundle Pack", price: 1500, category: "bundle", emoji: "🍬", description: "Stickers, Washitape, Erasers, Hairties, Paper soap, Pens, Pencils, Scrunchies", items: "Stickers, Washitape, Erasers, Hairties, Paper soap, Pens, Pencils, Scrunchies", stock: 50, rating: 4.9, reviews: 245, isFeatured: true },
    { name: "Dreamy Delight Bundle Pack", price: 2200, category: "bundle", emoji: "✨", description: "Lip gloss, Face masks, Earrings, Mini notebooks, Sticky notes, Highlighter, Mirror, Eye mask", items: "Lip gloss, Face masks, Earrings, Mini notebooks, Sticky notes, Highlighter, Mirror, Eye mask", stock: 40, rating: 4.8, reviews: 182, isFeatured: true },
    { name: "Cloud Nine Bundle Pack", price: 4500, category: "bundle", emoji: "☁️", description: "Planners, Journals, Multicolor pens, Watches, Necklaces, Jewelry boxes, Mystery box, Full-sized bag", items: "Planners, Journals, Multicolor pens, Watches, Necklaces, Jewelry boxes, Mystery box, Full-sized bag", stock: 30, rating: 5.0, reviews: 520, isFeatured: true },

    // ─── Special Deals ───
    { name: "CandyCloud Basket", price: 2500, category: "special-deal", emoji: "☀️", description: "Curated CandyCloud basket with premium goodies", stock: 25, rating: 4.9, reviews: 90, isFeatured: true },
    { name: "Customize Cloud Deal", price: 3500, category: "special-deal", emoji: "🌈", description: "10 products of your choice - custom bundle", stock: 20, rating: 5.0, reviews: 60, isFeatured: true },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        // Insert products
        const created = await Product.insertMany(products);
        console.log(`🍬 Seeded ${created.length} products`);

        // Create admin user
        const adminExists = await User.findOne({ email: "admin@candycloud.com" });
        if (!adminExists) {
            await User.create({
                name: "CandyCloud Admin",
                email: "admin@candycloud.com",
                password: "admin123456",
                role: "admin",
                phone: "03001234567",
            });
            console.log("👑 Created admin user (admin@candycloud.com / admin123456)");
        }

        console.log("\n✅ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
};

seedDB();
