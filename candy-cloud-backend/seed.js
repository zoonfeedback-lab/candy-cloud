const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const Setting = require("./models/Setting");

dotenv.config();

// ─── Products matching /shop page categories exactly ───
const products = [
    // ─── Sweet Treat (🍬) ───
    { name: "Stickers", price: 150, category: "sweet-treat", emoji: "🏷️", description: "Adorable pastel stickers for journals & planners", stock: 200, rating: 4.9, reviews: 120 },
    { name: "Washi Tape", price: 200, category: "sweet-treat", emoji: "🎀", description: "Beautiful decorative washi tape rolls", stock: 150, rating: 4.8, reviews: 85 },
    { name: "Erasers", price: 100, category: "sweet-treat", emoji: "🧹", description: "Fun-shaped cute erasers", stock: 300, rating: 4.7, reviews: 200 },
    { name: "Hair Ties", price: 120, category: "sweet-treat", emoji: "💇‍♀️", description: "Colorful elastic hair ties set", stock: 180, rating: 4.6, reviews: 95 },
    { name: "Paper Soap", price: 100, category: "sweet-treat", emoji: "🧼", description: "Portable paper soap sheets", stock: 250, rating: 4.9, reviews: 150 },
    { name: "Bookmarks", price: 80, category: "sweet-treat", emoji: "🔖", description: "Cute magnetic bookmarks set", stock: 200, rating: 4.5, reviews: 90 },
    { name: "Pens", price: 130, category: "sweet-treat", emoji: "🖊️", description: "Kawaii pens with smooth ink flow", stock: 220, rating: 4.8, reviews: 170 },
    { name: "Pencils", price: 100, category: "sweet-treat", emoji: "✏️", description: "Cute character mechanical pencils", stock: 200, rating: 4.5, reviews: 70 },
    { name: "Sharpener", price: 80, category: "sweet-treat", emoji: "✂️", description: "Mini animal-shaped sharpeners", stock: 250, rating: 4.4, reviews: 55 },
    { name: "Scale", price: 120, category: "sweet-treat", emoji: "📏", description: "Flexible foldable cute ruler", stock: 180, rating: 4.3, reviews: 45 },
    { name: "Key Chain", price: 150, category: "sweet-treat", emoji: "🔑", description: "Adorable character keychains", stock: 160, rating: 4.7, reviews: 130 },
    { name: "Phone Ring", price: 180, category: "sweet-treat", emoji: "📱", description: "Cute phone grip ring holder", stock: 140, rating: 4.6, reviews: 100 },
    { name: "Lip Balm", price: 200, category: "sweet-treat", emoji: "💋", description: "Fruity moisturizing lip balm", stock: 170, rating: 4.8, reviews: 140 },
    { name: "Nail File", price: 100, category: "sweet-treat", emoji: "💅", description: "Cute patterned nail files", stock: 200, rating: 4.4, reviews: 60 },
    { name: "Mini Wipes", price: 80, category: "sweet-treat", emoji: "🧻", description: "Portable mini wet wipes pack", stock: 300, rating: 4.5, reviews: 80 },
    { name: "Hair Clips", price: 150, category: "sweet-treat", emoji: "📎", description: "Aesthetic hair clip set", stock: 190, rating: 4.7, reviews: 110 },
    { name: "Scrunchies", price: 180, category: "sweet-treat", emoji: "🎀", description: "Soft velvet scrunchies pack", stock: 160, rating: 4.7, reviews: 130 },

    // ─── Dreamy Delight (✨) ───
    { name: "Lip Gloss", price: 350, category: "dreamy-delight", emoji: "💄", description: "Shimmery rose-tinted lip gloss", stock: 100, rating: 4.9, reviews: 180 },
    { name: "Face Masks", price: 280, category: "dreamy-delight", emoji: "🧖‍♀️", description: "Hydrating sheet mask set", stock: 200, rating: 4.8, reviews: 160 },
    { name: "Hand Cream", price: 300, category: "dreamy-delight", emoji: "🧴", description: "Moisturizing scented hand cream", stock: 150, rating: 4.7, reviews: 120 },
    { name: "Hair Claws", price: 250, category: "dreamy-delight", emoji: "🦀", description: "Aesthetic acrylic hair claw clips", stock: 130, rating: 4.6, reviews: 95 },
    { name: "Earrings", price: 350, category: "dreamy-delight", emoji: "💎", description: "Elegant drop earrings set", stock: 80, rating: 4.9, reviews: 140 },
    { name: "Rings", price: 300, category: "dreamy-delight", emoji: "💍", description: "Dainty stackable rings", stock: 90, rating: 4.8, reviews: 110 },
    { name: "Hair Band", price: 200, category: "dreamy-delight", emoji: "👑", description: "Pretty padded headbands", stock: 170, rating: 4.6, reviews: 85 },
    { name: "Popsockets", price: 250, category: "dreamy-delight", emoji: "📱", description: "Cute character phone grips", stock: 140, rating: 4.5, reviews: 100 },
    { name: "Mini Notebooks", price: 180, category: "dreamy-delight", emoji: "📒", description: "Pocket-sized cute notebooks", stock: 200, rating: 4.6, reviews: 90 },
    { name: "Sticky Notes", price: 120, category: "dreamy-delight", emoji: "📝", description: "Pastel gradient sticky note set", stock: 250, rating: 4.7, reviews: 170 },
    { name: "Highlighter", price: 200, category: "dreamy-delight", emoji: "🖍️", description: "Dual-tip pastel highlighters", stock: 180, rating: 4.5, reviews: 110 },
    { name: "Marker", price: 220, category: "dreamy-delight", emoji: "🖊️", description: "Fine-tip art markers set", stock: 150, rating: 4.6, reviews: 95 },
    { name: "Memopads", price: 150, category: "dreamy-delight", emoji: "🗒️", description: "Cute shape memo pads", stock: 200, rating: 4.4, reviews: 75 },
    { name: "Card Holder", price: 350, category: "dreamy-delight", emoji: "💳", description: "Leather card holder wallet", stock: 100, rating: 4.8, reviews: 130 },
    { name: "Coin Purse", price: 280, category: "dreamy-delight", emoji: "👛", description: "Mini kawaii coin purse", stock: 120, rating: 4.7, reviews: 105 },
    { name: "Mirror", price: 250, category: "dreamy-delight", emoji: "🪞", description: "Heart-shaped compact mirror", stock: 110, rating: 4.8, reviews: 140 },
    { name: "Socks", price: 200, category: "dreamy-delight", emoji: "🧦", description: "Cute patterned cotton socks", stock: 180, rating: 4.5, reviews: 90 },
    { name: "Phone Charm", price: 180, category: "dreamy-delight", emoji: "✨", description: "Beaded phone charm strap", stock: 160, rating: 4.7, reviews: 120 },
    { name: "Eye Mask", price: 350, category: "dreamy-delight", emoji: "😴", description: "Silk sleep eye mask", stock: 90, rating: 4.9, reviews: 75 },
    { name: "Lipliner", price: 300, category: "dreamy-delight", emoji: "💄", description: "Long-lasting lipliner pencil", stock: 120, rating: 4.6, reviews: 80 },
    { name: "Nail Clipper", price: 200, category: "dreamy-delight", emoji: "💅", description: "Cute animal nail clipper", stock: 150, rating: 4.4, reviews: 65 },

    // ─── Cloud Nine (☁️) ───
    { name: "Planners", price: 800, category: "cloud-nine", emoji: "📅", description: "Full-year aesthetic planner with stickers", stock: 60, rating: 5.0, reviews: 320 },
    { name: "Journals", price: 650, category: "cloud-nine", emoji: "📓", description: "Premium leather-bound journal", stock: 80, rating: 4.9, reviews: 250 },
    { name: "Notebook", price: 500, category: "cloud-nine", emoji: "📔", description: "Hardcover thick paper notebook", stock: 100, rating: 4.8, reviews: 190 },
    { name: "Multicolor Pens", price: 450, category: "cloud-nine", emoji: "🖊️", description: "10-color retractable pen set", stock: 90, rating: 4.8, reviews: 170 },
    { name: "Watches", price: 1200, category: "cloud-nine", emoji: "⌚", description: "Delicate butterfly face watch", stock: 40, rating: 4.9, reviews: 85 },
    { name: "Necklaces", price: 900, category: "cloud-nine", emoji: "📿", description: "Crystal pendant necklace", stock: 50, rating: 5.0, reviews: 120 },
    { name: "Bracelet", price: 700, category: "cloud-nine", emoji: "💎", description: "Charm bracelet with beads", stock: 60, rating: 4.8, reviews: 100 },
    { name: "Jewelry Boxes", price: 750, category: "cloud-nine", emoji: "🎁", description: "Two-tier velvet jewelry organizer", stock: 70, rating: 4.7, reviews: 95 },
    { name: "Building Blocks", price: 600, category: "cloud-nine", emoji: "🧱", description: "Mini building brick figure set", stock: 80, rating: 4.6, reviews: 110 },
    { name: "Diamond Painting Kits", price: 850, category: "cloud-nine", emoji: "🎨", description: "DIY diamond art painting kit", stock: 50, rating: 4.9, reviews: 140 },
    { name: "Mystery Box", price: 1500, category: "cloud-nine", emoji: "🎁", description: "Premium mystery box of curated goodies", stock: 30, rating: 5.0, reviews: 500 },
    { name: "Full-Sized Bag", price: 1000, category: "cloud-nine", emoji: "👜", description: "Canvas tote bag with premium design", stock: 60, rating: 4.8, reviews: 170 },
    { name: "Pouch", price: 500, category: "cloud-nine", emoji: "👝", description: "Cute cosmetic pouch", stock: 100, rating: 4.7, reviews: 130 },
    { name: "Wallet", price: 650, category: "cloud-nine", emoji: "👛", description: "Compact patterned wallet", stock: 80, rating: 4.6, reviews: 90 },
    { name: "Lipstick", price: 550, category: "cloud-nine", emoji: "💄", description: "Matte velvet finish lipstick", stock: 70, rating: 4.8, reviews: 160 },
    { name: "Eyeliner", price: 400, category: "cloud-nine", emoji: "👁️", description: "Waterproof precision eyeliner pen", stock: 90, rating: 4.7, reviews: 120 },
    { name: "Nails", price: 350, category: "cloud-nine", emoji: "💅", description: "Press-on nail set with glue", stock: 100, rating: 4.5, reviews: 80 },
    { name: "Brooch", price: 450, category: "cloud-nine", emoji: "🌸", description: "Vintage style flower brooch", stock: 60, rating: 4.6, reviews: 70 },
    { name: "Hair Brush", price: 400, category: "cloud-nine", emoji: "💇‍♀️", description: "Detangling paddle hair brush", stock: 80, rating: 4.5, reviews: 85 },

    // ─── Featured Bundles ───
    { name: "Sweet Treat Bundle Pack", price: 1500, category: "bundle", emoji: "🍬", description: "Stickers, Washi Tape, Erasers, Hair Ties, Paper Soap, Pens, Pencils, Scrunchies", items: "Stickers, Washi Tape, Erasers, Hair Ties, Paper Soap, Pens, Pencils, Scrunchies", stock: 50, rating: 4.9, reviews: 245, isFeatured: true },
    { name: "Dreamy Delight Bundle Pack", price: 2200, category: "bundle", emoji: "✨", description: "Lip Gloss, Face Masks, Earrings, Mini Notebooks, Sticky Notes, Highlighter, Mirror, Eye Mask", items: "Lip Gloss, Face Masks, Earrings, Mini Notebooks, Sticky Notes, Highlighter, Mirror, Eye Mask", stock: 40, rating: 4.8, reviews: 182, isFeatured: true },
    { name: "Cloud Nine Bundle Pack", price: 4500, category: "bundle", emoji: "☁️", description: "Planners, Journals, Multicolor Pens, Watches, Necklaces, Jewelry Boxes, Mystery Box, Full-Sized Bag", items: "Planners, Journals, Multicolor Pens, Watches, Necklaces, Jewelry Boxes, Mystery Box, Full-Sized Bag", stock: 30, rating: 5.0, reviews: 520, isFeatured: true },

    // ─── Special Deals ───
    { name: "CandyCloud Basket", price: 2500, category: "special-deal", emoji: "☀️", description: "Curated CandyCloud basket with premium goodies", stock: 25, rating: 4.9, reviews: 90, isFeatured: true },
    { name: "Customize Cloud Deal", price: 3500, category: "special-deal", emoji: "🌈", description: "10 products of your choice - custom bundle", stock: 20, rating: 5.0, reviews: 60, isFeatured: true },
];

// ─── Sample Customers ───
const sampleCustomers = [
    { name: "Ayesha Khan", email: "ayesha@example.com", password: "password123", phone: "03001112233" },
    { name: "Fatima Malik", email: "fatima@example.com", password: "password123", phone: "03002223344" },
    { name: "Zara Ahmed", email: "zara@example.com", password: "password123", phone: "03003334455" },
    { name: "Hania Aamir", email: "hania@example.com", password: "password123", phone: "03004445566" },
    { name: "Sara Rizvi", email: "sara@example.com", password: "password123", phone: "03005556677" },
];

// Helper to create a date N days ago
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Setting.deleteMany({});
        console.log("🗑️  Cleared existing products, orders, and settings");

        // Seed default settings
        const defaultSettings = [
            { key: "storeName", value: "CandyCloud" },
            { key: "supportEmail", value: "Info.candycloud1@gmail.com" },
            { key: "businessAddress", value: "123 Marshmallow Lane, Sugar Valley, Karachi" },
            { key: "primaryColor", value: "#ec4899" },
            { key: "secondaryColor", value: "#f0426e" },
            { key: "nationwideDelivery", value: true },
            { key: "expressRate", value: 500 },
            { key: "codEnabled", value: true },
            { key: "jazzCashEnabled", value: true },
            { key: "easypaisaEnabled", value: true },
            { key: "stripeEnabled", value: true }
        ];
        await Setting.insertMany(defaultSettings);
        console.log("⚙️  Seeded default settings");

        // Insert products
        const createdProducts = await Product.insertMany(products);
        console.log(`🍬 Seeded ${createdProducts.length} products`);

        // Create admin user
        let adminUser;
        const adminExists = await User.findOne({ email: "admin@candycloud.com" });
        if (!adminExists) {
            adminUser = await User.create({
                name: "CandyCloud Admin",
                email: "admin@candycloud.com",
                password: "admin123456",
                role: "admin",
                phone: "03001234567",
            });
            console.log("👑 Created admin user (admin@candycloud.com / admin123456)");
        } else {
            adminUser = adminExists;
            console.log("👑 Admin user already exists");
        }

        // Create sample customers
        const customerUsers = [];
        for (const cust of sampleCustomers) {
            const exists = await User.findOne({ email: cust.email });
            if (!exists) {
                const created = await User.create(cust);
                customerUsers.push(created);
            } else {
                customerUsers.push(exists);
            }
        }
        console.log(`👥 Ensured ${customerUsers.length} sample customers`);

        // ─── Create Sample Orders ───
        const statuses = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
        const paymentMethods = ["cod", "jazzcash", "easypaisa", "cod", "cod"];
        const shippingMethods = ["standard", "express", "standard", "express", "standard"];

        const sampleOrders = [];

        for (let i = 0; i < customerUsers.length; i++) {
            const customer = customerUsers[i];
            const orderStatus = statuses[i % statuses.length];
            const daysOffset = (customerUsers.length - i) * 2;

            const numItems = Math.floor(Math.random() * 3) + 1;
            const shuffled = [...createdProducts].sort(() => 0.5 - Math.random());
            const pickedProducts = shuffled.slice(0, numItems);

            const items = pickedProducts.map(p => ({
                product: p._id.toString(),
                name: p.name,
                emoji: p.emoji,
                price: p.price,
                quantity: Math.floor(Math.random() * 3) + 1,
                description: p.description,
            }));

            const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shippingCost = shippingMethods[i] === "express" ? 250 : 150;
            const total = subtotal + shippingCost;

            const trackingHistory = [];
            const statusIndex = statuses.indexOf(orderStatus);

            if (orderStatus === "cancelled") {
                trackingHistory.push({ status: "placed", message: "Order has been placed successfully", timestamp: daysAgo(daysOffset) });
                trackingHistory.push({ status: "cancelled", message: "Order cancelled by customer", timestamp: daysAgo(daysOffset - 1) });
            } else {
                const progressStatuses = statuses.slice(0, statusIndex + 1).filter(s => s !== "cancelled");
                const messages = {
                    placed: "Order has been placed successfully",
                    confirmed: "Order has been confirmed and is being prepared",
                    processing: "Order is being packed with love 💖",
                    shipped: "Order has been shipped! On its way to you",
                    out_for_delivery: "Order is out for delivery — almost there!",
                    delivered: "Order has been delivered. Enjoy your goodies! 🎉",
                };
                progressStatuses.forEach((s, j) => {
                    trackingHistory.push({
                        status: s,
                        message: messages[s],
                        timestamp: daysAgo(daysOffset - j),
                    });
                });
            }

            sampleOrders.push({
                user: customer._id,
                items,
                subtotal,
                shippingCost,
                total,
                shippingAddress: {
                    firstName: customer.name.split(" ")[0],
                    lastName: customer.name.split(" ").slice(1).join(" ") || "Cloud",
                    address: `${Math.floor(Math.random() * 200) + 1} Sugar Lane`,
                    city: ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi"][i],
                    zipCode: `${54000 + i * 1000}`,
                },
                shippingMethod: shippingMethods[i],
                paymentMethod: paymentMethods[i],
                paymentStatus: orderStatus === "delivered" ? "paid" : "pending",
                orderStatus,
                trackingHistory,
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            });
        }

        // Add extra orders for variety
        for (let j = 0; j < 5; j++) {
            const customer = customerUsers[j % customerUsers.length];
            const statusOptions = ["placed", "processing", "shipped"];
            const orderStatus = statusOptions[j % statusOptions.length];
            const daysOffset = j + 1;

            const numItems = Math.floor(Math.random() * 2) + 1;
            const shuffled = [...createdProducts].sort(() => 0.5 - Math.random());
            const items = shuffled.slice(0, numItems).map(p => ({
                product: p._id.toString(),
                name: p.name,
                emoji: p.emoji,
                price: p.price,
                quantity: 1,
                description: p.description,
            }));

            const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shippingCost = 150;
            const total = subtotal + shippingCost;

            const trackingHistory = [{ status: "placed", message: "Order has been placed successfully", timestamp: daysAgo(daysOffset) }];
            if (orderStatus !== "placed") {
                trackingHistory.push({ status: "confirmed", message: "Order confirmed", timestamp: daysAgo(daysOffset - 0.5) });
            }
            if (orderStatus === "processing") {
                trackingHistory.push({ status: "processing", message: "Order is being packed with love 💖", timestamp: daysAgo(daysOffset - 1) });
            }
            if (orderStatus === "shipped") {
                trackingHistory.push({ status: "processing", message: "Order is being packed with love 💖", timestamp: daysAgo(daysOffset - 1) });
                trackingHistory.push({ status: "shipped", message: "Order has been shipped!", timestamp: daysAgo(daysOffset - 1.5) });
            }

            sampleOrders.push({
                user: customer._id,
                items,
                subtotal,
                shippingCost,
                total,
                shippingAddress: {
                    firstName: customer.name.split(" ")[0],
                    lastName: customer.name.split(" ").slice(1).join(" ") || "Cloud",
                    address: `${Math.floor(Math.random() * 200) + 1} Candy Avenue`,
                    city: "Lahore",
                    zipCode: "54000",
                },
                shippingMethod: "standard",
                paymentMethod: "cod",
                paymentStatus: "pending",
                orderStatus,
                trackingHistory,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
        }

        for (const orderData of sampleOrders) {
            await Order.create(orderData);
        }
        console.log(`📦 Seeded ${sampleOrders.length} sample orders`);

        console.log("\n✅ Database seeded successfully!");
        console.log("─────────────────────────────────");
        console.log("👑 Admin Login: admin@candycloud.com / admin123456");
        console.log(`🍬 ${createdProducts.length} products (17 Sweet Treat + 21 Dreamy Delight + 19 Cloud Nine + 3 Bundles + 2 Deals)`);
        console.log(`👥 ${customerUsers.length} customers`);
        console.log(`📦 ${sampleOrders.length} orders (various statuses)`);
        console.log("─────────────────────────────────");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
};

seedDB();
