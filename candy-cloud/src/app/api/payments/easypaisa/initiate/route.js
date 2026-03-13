import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { handleError } from "@/lib/apiError";

export async function POST(request) {
    try {
        await connectDB();
        await requireAuth(request);
        const { amount, orderId } = await request.json();

        const storeId = process.env.EASYPAISA_STORE_ID || "TEST_STORE";
        const hashKey = process.env.EASYPAISA_HASH_KEY || "TEST_KEY";
        const orderRefNum = `CC-ORD-${orderId}`;
        const amountFormatted = (amount * 1).toFixed(1);
        const postBackURL = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/payments/easypaisa/callback`;

        const hashString = `amount=${amountFormatted}&orderRefNum=${orderRefNum}&storeId=${storeId}`;
        const merchantHashedReq = CryptoJS.HmacSHA256(hashString, hashKey).toString(CryptoJS.enc.Hex).toUpperCase();

        const paymentData = {
            storeId,
            orderId: orderRefNum,
            transactionAmount: amountFormatted,
            mobileAccountNo: "",
            emailAddress: "",
            postBackURL,
            merchantHashedReq,
        };

        return NextResponse.json({
            success: true,
            paymentData,
            paymentUrl: "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf",
        });
    } catch (error) {
        return handleError(error);
    }
}
