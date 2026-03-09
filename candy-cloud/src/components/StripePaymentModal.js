"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripePaymentModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);
        setMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL parameter is omitted because we use redirect: "if_required"
            },
            redirect: "if_required"
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onPaymentSuccess();
        } else {
            setMessage("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1f36]/60 p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100">
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_4px_14px_rgba(236,72,153,0.3)]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Complete Payment</h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Amount to pay: <span className="font-bold text-pink-500 text-base">Rs {totalAmount.toLocaleString()}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="px-1 min-h-[200px]">
                        <PaymentElement options={{
                            layout: "tabs",
                            rules: {
                                '.Input': {
                                    padding: '12px',
                                    borderRadius: '12px',
                                    borderColor: '#E5E7EB',
                                    color: '#374151',
                                }
                            }
                        }} />
                    </div>

                    {message && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-2">
                        <button
                            disabled={isLoading || !stripe || !elements}
                            type="submit"
                            className={`w-full py-4 rounded-xl text-white font-black text-lg transition-all flex items-center justify-center gap-2 ${isLoading || !stripe || !elements ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-[#1a1f36] hover:bg-black shadow-lg hover:-translate-y-0.5"}`}
                        >
                            {isLoading ? "Processing..." : `Pay Rs ${totalAmount.toLocaleString()}`}
                            {!isLoading && <span className="text-xl leading-none">💳</span>}
                        </button>

                        <p className="text-center text-[11px] text-gray-400 font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 mt-2 opacity-80">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Secure checkout by Stripe
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
