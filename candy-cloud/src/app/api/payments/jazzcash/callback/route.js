import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

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
        const data = await request.json();
        const salt = process.env.JAZZCASH_INTEGRITY_SALT;

        const calculatedHash = generateJazzCashSecureHash(data, salt);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

        if (calculatedHash !== data.pp_SecureHash) {
            console.error("JazzCash Hash Mismatch!", { received: data.pp_SecureHash, calculated: calculatedHash });
            return NextResponse.redirect(`${baseUrl}/payment/error?reason=hash_mismatch`);
        }

        const billRef = data.pp_BillReference || "";
        const orderId = billRef.replace("CC-ORD-", "");

        if (data.pp_ResponseCode === "000") {
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid" });
            }
            return NextResponse.redirect(`${baseUrl}/success?gateway=jazzcash`);
        } else {
            console.error("JazzCash Payment Failed:", data.pp_ResponseMessage);
            return NextResponse.redirect(`${baseUrl}/payment/error?reason=${encodeURIComponent(data.pp_ResponseMessage)}`);
        }
    } catch (error) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        return NextResponse.redirect(`${baseUrl}/payment/error?reason=server_error`);
    }
}
