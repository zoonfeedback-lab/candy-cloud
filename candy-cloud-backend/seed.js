const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

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
        console.log("🗑️  Cleared existing products and orders");

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

            // Pick 1-3 random products for this order
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

            // Build tracking history based on current status
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
                    street: `${Math.floor(Math.random() * 200) + 1} Sugar Lane`,
                    city: ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi"][i],
                    zip: `${54000 + i * 1000}`,
                    phone: customer.phone,
                },
                shippingMethod: shippingMethods[i],
                paymentMethod: paymentMethods[i],
                paymentStatus: orderStatus === "delivered" ? "paid" : "pending",
                orderStatus,
                trackingHistory,
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            });
        }

        // Add a couple extra orders for more data
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
                    street: `${Math.floor(Math.random() * 200) + 1} Candy Avenue`,
                    city: "Lahore",
                    zip: "54000",
                    phone: customer.phone,
                },
                shippingMethod: "standard",
                paymentMethod: "cod",
                paymentStatus: "pending",
                orderStatus,
                trackingHistory,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
        }

        // Insert all orders (bypass the pre-save hook for orderNumber by using create)
        for (const orderData of sampleOrders) {
            await Order.create(orderData);
        }
        console.log(`📦 Seeded ${sampleOrders.length} sample orders`);

        console.log("\n✅ Database seeded successfully!");
        console.log("─────────────────────────────────");
        console.log("👑 Admin Login: admin@candycloud.com / admin123456");
        console.log(`🍬 ${createdProducts.length} products`);
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
