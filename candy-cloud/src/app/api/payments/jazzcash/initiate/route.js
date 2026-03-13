import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";

function generateJazzCashSecureHash(data, salt) {
    const keys = Object.keys(data).sort();
    const filteredKeys = keys.filter(
        (key) => data[key] !== "" && data[key] !== null && data[key] !== undefined && key !== "pp_SecureHash"
    );

    let hashString = salt;
    filteredKeys.forEach((key) => {
        hashString += `&${data[key]}`;
    });

    return CryptoJS.HmacSHA256(hashString, salt).toString(CryptoJS.enc.Hex).toUpperCase();
}

export async function POST(request) {
    try {
        await connectDB();
        await requireAuth(request);
        const { amount, orderId } = await request.json();

        const salt = process.env.JAZZCASH_INTEGRITY_SALT || "TEST_SALT";
        const dateNow = new Date();
        const expiryDate = new Date(dateNow.getTime() + 60 * 60 * 1000);

        const formatJCDate = (d) => {
            return d.getFullYear().toString() +
                (d.getMonth() + 1).toString().padStart(2, "0") +
                d.getDate().toString().padStart(2, "0") +
                d.getHours().toString().padStart(2, "0") +
                d.getMinutes().toString().padStart(2, "0") +
                d.getSeconds().toString().padStart(2, "0");
        };

        const paymentData = {
            pp_Language: "EN",
            pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID || "TEST_MERCHANT",
            pp_SubMerchantID: "",
            pp_Password: process.env.JAZZCASH_PASSWORD || "TEST_PASS",
            pp_BankID: "TBANK",
            pp_ProductID: "RETL",
            pp_Amount: amount * 100,
            pp_TxnCurrency: "PKR",
            pp_TxnDateTime: formatJCDate(dateNow),
            pp_BillReference: `CC-ORD-${orderId}`,
            pp_Description: "Candy Cloud Order Payment",
            pp_TxnExpiryDateTime: formatJCDate(expiryDate),
            pp_ReturnURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/payments/jazzcash/callback`,
            pp_TxnType: "MWALLET",
            pp_TxnRefNo: `TNX${Date.now()}`,
        };

        paymentData.pp_SecureHash = generateJazzCashSecureHash(paymentData, salt);

        return NextResponse.json({
            success: true,
            paymentData,
            paymentUrl: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/",
        });
    } catch (error) {
        return handleError(error);
    }
}
