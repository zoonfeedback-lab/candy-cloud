# Candy Cloud 🍬☁️

Welcome to **Candy Cloud**, a magical e-commerce platform dedicated to bringing you the cutest stationery, accessories, beauty products, and sweetest treats! 

Originally built as a split Express.js backend and Next.js frontend, this project has been fully migrated into a **Unified Next.js App Router** architecture. It is fully serverless, highly optimized, and ready to be deployed as a single application on Vercel.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) (Serverless cached connection)
- **Authentication:** Custom JWT via HttpOnly Cookies, OTP Email Verification via [Nodemailer](https://nodemailer.com/), Google OAuth
- **Payments:** [Stripe](https://stripe.com/) (Credit/Debit), JazzCash, EasyPaisa, & Cash on Delivery (COD)
- **Animation & Extras:** Canvas Confetti

---

## ✨ Features

### 🛍️ Customer Experience
- **Interactive Storefront:** Browse diverse product categories (Sweet Treat, Dreamy Delight, Cloud Nine, Bundles, Special Deals).
- **Mystery SCOOP:** A fun, gamified "Mystery Scoop" experience.
- **Prize Spinner:** Welcome spinner providing discount codes and free gifts for new sessions.
- **Cart & Checkout:** Real-time cart synchronization and a fully featured, multi-payment checkout.
- **Order Tracking:** Track your order statuses directly from the storefront without logging in.
- **Account Dashboard:** View order histories and manage preferences.

### 🛡️ Admin Dashboard (Protected `/admin`)
- **Dashboard Analytics:** High-level KPIs, recent orders, and inventory alerts.
- **Order Management:** View, update statuses, and track fulfillment for all orders.
- **Inventory Management:** Full CRUD operations for the product catalog.
- **Customer Directory:** Track user registration and lifetime value.
- **Store Settings:** Dynamic preference management (Shipping Rates, Colors, Toggle Payment Methods directly from the dashboard).

---

## 🗺️ Routes & Architecture

### Frontend Navigation
- `/` — Homepage & Hero 
- `/shop` — Complete Product Catalog
- `/shop/[slug]` — Individual Product Details
- `/scoop` — Mystery Scoop Game
- `/cart` — User Shopping Cart
- `/checkout` — Shipping & Final Payment Steps
- `/success` — Order Confirmation
- `/track` — Order Status Tracking
- `/orders` — Logged-in User Order History
- `/login` & `/register` — Authentication pages
- `/admin/*` — Dedicated Admin Dashboard Pages (Orders, Inventory, Customers, Golden Scoop, Settings)

### Backend API Routes (`/api/...`)
Because this is a unified Next.js App Router project, all API endpoints live securely within the `/src/app/api/` directory.

- **`/api/auth/...`** — Handles login, registration, OTP generation/verification, refreshing tokens, and fetching user profiles.
- **`/api/products/...`** — Fetches catalog and resolves single products securely.
- **`/api/cart/...`** — Dedicated cart state management syncing the database.
- **`/api/orders/...`** — Order creation, user order history, and tracking logic.
- **`/api/payments/...`** — Stripe intent creation, stripe webhooks, JazzCash, and EasyPaisa integrations.
- **`/api/rewards/...`** — Validates and redeems the spinner rewards.
- **`/api/admin/...`** — Highly protected routes (requires Admin JWT) for pulling metrics and mutating store data.
- **`/api/settings`** — Retrieves and updates dynamic store configs.

---

## 💻 How to Run Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and npm installed. You will also need a MongoDB database URL.

### 2. Installation
Navigate into the main project directory and install the dependencies.
```bash
cd candy-cloud
npm install
```

### 3. Environment Variables
Create a `.env.local` file inside the `candy-cloud` directory. You will need the following configured:

```env
# MongoDB Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/candy-cloud

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Payment Gateways (Stripe)
NEXT_PUBLIC_STRIPE_PK=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email configuration (For OTP verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Optional: Google Auth & Local payment credentials if needed...
```
*(Note: Do not include `NEXT_PUBLIC_API_URL` as the app now natively resolves its own backend paths!)*

### 4. Database Seeding (Optional)
If you are starting from a fresh database, you can seed it with default products, an admin user, and settings:

```bash
# First build the Next.js runtime environment
npm run build

# Then run the seeder script
node scripts/seed.js
```
* **Default Admin Login:** `admin@candycloud.com`
* **Default Admin Password:** `admin123456`

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment

This repository is optimized automatically for **Vercel**. 

1. Push your code to GitHub.
2. Import the project in Vercel. Ensure the Framework Preset is set to `Next.js` and the Root Directory is set to `candy-cloud` (if deploying from the mono-repo root).
3. Add all the Environment Variables from your `.env.local` into the Vercel Dashboard.
4. Click **Deploy**. Vercel will automatically configure the serverless functions and asset routing.

Enjoy the sweetness! 🍭
