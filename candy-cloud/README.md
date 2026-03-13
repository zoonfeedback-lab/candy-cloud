# 🍬 Candy Cloud

Candy Cloud is a magical, modern e-commerce web application built for selling sweet treats, mystery boxes, and delightful gifts! It uses a fully unified Next.js architecture (App Router) which acts as both the frontend client and the backend API server.

## 🌟 Features
- **Frontend & Backend Unified**: Deploys as a single application on Vercel. 
- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies and email OTP verification.
- **Shopping Cart**: Real-time cart management, synced with the database for authenticated users.
- **Checkout Flow**: Complete checkout process supporting multiple payment methods (COD, Stripe, JazzCash, EasyPaisa).
- **Interactive UI**: Features a delightful "Prize Spinner", dynamic routing, and aesthetic modern design.
- **Comprehensive Admin Panel**: A dashboard to manage orders, catalog inventory, customer data, and store settings.

---

## 🚀 Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Database**: MongoDB (via Mongoose)
- **Styling**: Tailwind CSS
- **Authentication**: JWT & Next.js API Routes (Server-side Cookies)
- **Payments**: Stripe (Cards), JazzCash, EasyPaisa (Mocked/Integrated)
- **Email**: Nodemailer (OTP Verification)

---

## 🛠️ How to Run Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Connection URI (MongoDB Atlas or local)

### 2. Clone & Install Dependencies
\`\`\`bash
git clone <your-repo-url>
cd candy-cloud
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env.local\` file in the root of the project with the following keys. Ask the developer for the exact secret values.

\`\`\`env
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/candy-cloud

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_key
SESSION_SECRET=your_super_secret_session_key

# Payment Providers (Optional/Required based on features enabled)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PK=pk_test_...
JAZZCASH_MERCHANT_ID=...
JAZZCASH_PASSWORD=...
JAZZCASH_INTEGRITY_SALT=...
EASYPAISA_STORE_ID=...

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="Candy Cloud" <your_email@gmail.com>
\`\`\`

### 4. Seed the Database (Optional but recommended for first setup)
To populate the database with initial products, admin credentials, sample customers, and default settings, run:
\`\`\`bash
node scripts/seed.js
\`\`\`
*(This will log the generated Admin credentials to the console!)*

### 5. Start the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Project Structure & Routes

### Frontend Routes (Pages)
- \`/\` - Homepage (Hero, Categories, Bestsellers, Newsletter)
- \`/shop\` - Complete product catalog view
- \`/shop/[slug]\` - Individual Product Details Page
- \`/scoop\` - Special "Mystery Scoop" bundles page
- \`/cart\` - Shopping Cart review
- \`/checkout\` - Secure checkout and payment flow
- \`/track\` - Order Tracking interface
- \`/login\` & \`/register\` - Authentication pages
- \`/orders\` - User's personal order history

### Admin Routes (Dashboard - protected)
- \`/admin\` - Overview Dashboard (KPIs, Recent Orders)
- \`/admin/orders\` - Order Management
- \`/admin/orders/[id]\` - Detailed Order View (Update Status)
- \`/admin/inventory\` - Product Catalog Management (Add/Edit items)
- \`/admin/customers\` - Customer Database
- \`/admin/golden-scoop\` - Manage the Prize Spinner items
- \`/admin/settings\` - Configure Store Settings (Shipping rates, Payment toggles)

### Backend API Routes (\`/api/...\`)
Thanks to the Next.js App Router, the backend lives directly inside \`src/app/api\`.

**Auth**
- \`POST /api/auth/register\` - Create user account
- \`POST /api/auth/register/otp\` - Send verification OTP
- \`POST /api/auth/login\` - Authenticate and create session
- \`GET /api/auth/me\` - Verify session
- \`POST /api/auth/logout\` - Clear session cookies

**Products & Cart**
- \`GET /api/products\` - Fetch catalog
- \`GET /api/cart\` - Fetch user's cart
- \`POST /api/cart\` - Add to cart

**Checkout & Orders**
- \`POST /api/orders\` - Create a new order
- \`GET /api/orders/[id]\` - Get order details
- \`POST /api/payments/...\` - Initialize Stripe, JazzCash, EasyPaisa

**Admin Operations (Requires Admin Role)**
- \`GET /api/admin/dashboard\` - Fetch KPIs
- \`GET /POST /api/settings\` - Read/Update store settings
- \`POST /api/admin/inventory\` - Create/Update products

---

## 🚢 Deployment
Since the Express backend was fully migrated into Next.js, this app is designed to be deployed flawlessly on **Vercel**. 
Simply connect your GitHub repository to your Vercel account, set all your Environment Variables in the Vercel Dashboard, and hit Deploy! No custom server configurations required.
