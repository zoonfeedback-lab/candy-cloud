const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
exports.createStripeIntent = async (req, res, next) => {
    try {
        const { amount, orderId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects smallest currency unit (paisa for PKR)
            currency: "pkr",
            metadata: { orderId },
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/stripe/webhook
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: "paid",
                stripePaymentIntentId: paymentIntent.id,
            });
        }
    }

    res.json({ received: true });
};

const CryptoJS = require("crypto-js");

// Helper function to generate JazzCash secure hash
const generateJazzCashSecureHash = (data, salt) => {
    // 1. Sort keys alphabetically
    const keys = Object.keys(data).sort();

    // 2. Filter out empty fields and SecureHash itself
    const filteredKeys = keys.filter(
        key => data[key] !== "" && data[key] !== null && data[key] !== undefined && key !== "pp_SecureHash"
    );

    // 3. Concatenate values separated by '&' prefixed with Salt
    let hashString = salt;
    filteredKeys.forEach(key => {
        hashString += `&${data[key]}`;
    });

    // 4. Generate HMAC SHA256
    const hash = CryptoJS.HmacSHA256(hashString, salt).toString(CryptoJS.enc.Hex).toUpperCase();
    return hash;
};

// @desc    Initiate JazzCash payment
// @route   POST /api/payments/jazzcash/initiate
exports.initiateJazzCash = async (req, res, next) => {
    try {
        const { amount, orderId } = req.body;

        const salt = process.env.JAZZCASH_INTEGRITY_SALT || "TEST_SALT";

        // Define exact formatting for dates as required by JazzCash (YYYYMMDDHHMMSS)
        const dateNow = new Date();
        const expiryDate = new Date(dateNow.getTime() + 60 * 60 * 1000); // 1 hour expiry

        const formatJCDate = (d) => {
            return d.getFullYear().toString() +
                (d.getMonth() + 1).toString().padStart(2, '0') +
                d.getDate().toString().padStart(2, '0') +
                d.getHours().toString().padStart(2, '0') +
                d.getMinutes().toString().padStart(2, '0') +
                d.getSeconds().toString().padStart(2, '0');
        };

        const paymentData = {
            pp_Language: "EN",
            pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID || "TEST_MERCHANT",
            pp_SubMerchantID: "",
            pp_Password: process.env.JAZZCASH_PASSWORD || "TEST_PASS",
            pp_BankID: "TBANK",
            pp_ProductID: "RETL",
            pp_Amount: amount * 100, // Important: Amount in Paisa
            pp_TxnCurrency: "PKR",
            pp_TxnDateTime: formatJCDate(dateNow),
            pp_BillReference: `CC-ORD-${orderId}`,
            pp_Description: "Candy Cloud Order Payment",
            pp_TxnExpiryDateTime: formatJCDate(expiryDate),
            pp_ReturnURL: `${process.env.FRONTEND_URL}/api/checkout/jazzcash/callback`, // Needs full URL
            pp_TxnType: "MWALLET", // MWALLET or MPAY
            pp_TxnRefNo: `TNX${Date.now()}` // Unique transaction ID
        };

        // Generate Secure Hash
        paymentData.pp_SecureHash = generateJazzCashSecureHash(paymentData, salt);

        res.json({
            success: true,
            paymentData,
            paymentUrl: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/" // Sandbox URL
        });
    } catch (error) {
        next(error);
    }
};

// @desc    JazzCash callback handler
// @route   POST /api/payments/jazzcash/callback
exports.jazzcashCallback = async (req, res, next) => {
    try {
        const data = req.body;
        const salt = process.env.JAZZCASH_INTEGRITY_SALT;

        // 1. Verify Hash
        const calculatedHash = generateJazzCashSecureHash(data, salt);

        if (calculatedHash !== data.pp_SecureHash) {
            console.error("JazzCash Hash Mismatch!", { received: data.pp_SecureHash, calculated: calculatedHash });
            return res.redirect(`${process.env.FRONTEND_URL}/payment/error?reason=hash_mismatch`);
        }

        // 2. Extract Order ID
        const billRef = data.pp_BillReference || "";
        const orderId = billRef.replace("CC-ORD-", "");

        // 3. Process Status
        if (data.pp_ResponseCode === "000") {
            // Success
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: "paid"
                });
            }
            return res.redirect(`${process.env.FRONTEND_URL}/success?gateway=jazzcash`);
        } else {
            // Failed
            console.error("JazzCash Payment Failed:", data.pp_ResponseMessage);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/error?reason=${encodeURIComponent(data.pp_ResponseMessage)}`);
        }

    } catch (error) {
        next(error);
    }
};

// @desc    Initiate EasyPaisa payment
// @route   POST /api/payments/easypaisa/initiate
exports.initiateEasyPaisa = async (req, res, next) => {
    try {
        const { amount, orderId } = req.body;

        const storeId = process.env.EASYPAISA_STORE_ID || "TEST_STORE";
        const hashKey = process.env.EASYPAISA_HASH_KEY || "TEST_KEY";
        const orderRefNum = `CC-ORD-${orderId}`;
        const amountFormatted = (amount * 1).toFixed(1); // EasyPaisa expects amount in 1 decimal place usually
        const postBackURL = `${process.env.FRONTEND_URL}/api/checkout/easypaisa/callback`;

        // EasyPaisa requires calculating an HMAC SHA256 of: amount + orderRefNum + storeId
        const hashString = `amount=${amountFormatted}&orderRefNum=${orderRefNum}&storeId=${storeId}`;
        const merchantHashedReq = CryptoJS.HmacSHA256(hashString, hashKey).toString(CryptoJS.enc.Hex).toUpperCase();

        const paymentData = {
            storeId,
            orderId: orderRefNum,
            transactionAmount: amountFormatted,
            mobileAccountNo: "",
            emailAddress: "",
            postBackURL,
            merchantHashedReq
        };

        res.json({
            success: true,
            paymentData,
            paymentUrl: "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf" // Sandbox URL
        });
    } catch (error) {
        next(error);
    }
};

// @desc    EasyPaisa callback handler
// @route   POST /api/payments/easypaisa/callback
exports.easypaisaCallback = async (req, res, next) => {
    try {
        const data = req.body;
        const hashKey = process.env.EASYPAISA_HASH_KEY;

        // Verify response code is success
        if (data.transactionStatus !== "PAID" && data.transactionStatus !== "SUCCESS") {
            const reason = data.message || "Payment Failed";
            console.error("EasyPaisa Payment Failed:", reason);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/error?reason=${encodeURIComponent(reason)}`);
        }

        // EasyPaisa commonly only sends the status back, sometimes encrypted
        // For standard integration, we confirm status and verify the order
        const billRef = data.orderId || "";
        const orderId = billRef.replace("CC-ORD-", "");

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: "paid"
            });
        }

        return res.redirect(`${process.env.FRONTEND_URL}/success?gateway=easypaisa`);

    } catch (error) {
        next(error);
    }
};
