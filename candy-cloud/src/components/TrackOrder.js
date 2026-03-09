"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const STATUS_STEPS = [
    { key: "placed", label: "Order Placed", emoji: "📦", color: "bg-pink-500" },
    { key: "confirmed", label: "Confirmed", emoji: "✅", color: "bg-blue-500" },
    { key: "processing", label: "Processing", emoji: "⚙️", color: "bg-yellow-500" },
    { key: "shipped", label: "Shipped", emoji: "🚚", color: "bg-purple-500" },
    { key: "out_for_delivery", label: "Out for Delivery", emoji: "🏃", color: "bg-orange-500" },
    { key: "delivered", label: "Delivered", emoji: "🎉", color: "bg-green-500" },
];

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [orderNumber, setOrderNumber] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Auto-fill and auto-track from query param
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setOrderNumber(q.toUpperCase());
            trackByNumber(q.toUpperCase());
        }
    }, []);

    const trackByNumber = async (num) => {
        setError("");
        setLoading(true);
        setOrder(null);
        try {
            const res = await fetch(`${API_URL}/api/orders/track/${num}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
            } else {
                setError(data.message || "Order not found");
            }
        } catch (err) {
            setError("Could not connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;
        trackByNumber(orderNumber.trim());
    };

    const isCancelled = order?.orderStatus === "cancelled";
    const currentStepIndex = isCancelled
        ? -1
        : STATUS_STEPS.findIndex((s) => s.key === order?.orderStatus);

    return (
        <section className="py-16 px-5 max-w-[700px] mx-auto w-full min-h-[70vh]">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="text-5xl mb-4">📦</div>
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">Track Your Order</h1>
                <p className="text-gray-500 text-sm mt-2">Enter your order number to see real-time status</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleTrack} className="mb-10">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                            placeholder="CC-00001"
                            className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-pink-100 focus:border-pink-300 text-base font-bold text-gray-700 outline-none focus:ring-4 focus:ring-pink-50 transition-all placeholder:text-gray-300 tracking-widest"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">🔍</span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !orderNumber.trim()}
                        className={`px-8 py-4 rounded-2xl text-white font-black text-sm tracking-wide transition-all ${loading || !orderNumber.trim()
                            ? "bg-pink-300 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600 hover:-translate-y-0.5 shadow-[0_6px_15px_rgba(236,72,153,0.3)]"
                            }`}
                    >
                        {loading ? "Tracking..." : "Track"}
                    </button>
                </div>
            </form>

            {/* Error */}
            {error && (
                <div className="text-center p-5 rounded-2xl bg-red-50 border border-red-200 mb-8">
                    <div className="text-3xl mb-2">😔</div>
                    <p className="text-red-600 font-bold text-sm">{error}</p>
                    <p className="text-red-400 text-xs mt-1">Double-check your order number and try again</p>
                </div>
            )}

            {/* Order Result */}
            {order && (
                <div className="space-y-6">
                    {/* Order Info Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order Number</p>
                                <p className="text-lg font-black text-gray-800 tracking-wider">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                                <p className="text-lg font-black text-pink-500">Rs {order.total?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment</p>
                                <p className="text-xs font-bold text-gray-700 mt-1">{order.paymentMethod?.toUpperCase()}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${order.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                                    }`}>{order.paymentStatus}</span>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Shipping</p>
                                <p className="text-xs font-bold text-gray-700 mt-1">{order.shippingMethod === "express" ? "Express ⚡" : "Standard 📦"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Est. Delivery</p>
                                <p className="text-xs font-bold text-gray-700 mt-1">
                                    {order.estimatedDelivery
                                        ? new Date(order.estimatedDelivery).toLocaleDateString("en-PK", { day: "numeric", month: "short" })
                                        : "—"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Progress or Cancelled */}
                    {isCancelled ? (
                        <div className="bg-red-50 rounded-3xl p-6 border border-red-200 text-center">
                            <div className="text-4xl mb-2">❌</div>
                            <p className="text-red-600 font-black text-lg">Order Cancelled</p>
                            <p className="text-red-400 text-xs mt-1">
                                {order.trackingHistory?.find(e => e.status === "cancelled")?.message || "This order has been cancelled"}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
                            <h3 className="text-sm font-black text-gray-800 mb-6">Order Progress</h3>
                            <div className="flex items-start justify-between relative">
                                {/* Progress Bar Background */}
                                <div className="absolute top-5 left-[8%] right-[8%] h-1 bg-gray-100 rounded-full" />
                                {/* Progress Bar Fill */}
                                <div
                                    className="absolute top-5 left-[8%] h-1 bg-gradient-to-r from-pink-500 to-green-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 84)}%` }}
                                />

                                {STATUS_STEPS.map((step, i) => {
                                    const isComplete = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;
                                    return (
                                        <div key={step.key} className="flex flex-col items-center relative z-10" style={{ width: `${100 / STATUS_STEPS.length}%` }}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${isCurrent
                                                ? `${step.color} text-white shadow-lg scale-110 ring-4 ring-opacity-30 ring-pink-300`
                                                : isComplete
                                                    ? `${step.color} text-white shadow-sm`
                                                    : "bg-gray-100 text-gray-400"
                                                }`}>
                                                {step.emoji}
                                            </div>
                                            <span className={`text-[9px] font-bold mt-2 text-center leading-tight ${isCurrent ? "text-pink-600" : isComplete ? "text-gray-700" : "text-gray-400"
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tracking Timeline */}
                    {order.trackingHistory && order.trackingHistory.length > 0 && (
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
                            <h3 className="text-sm font-black text-gray-800 mb-5">Tracking Timeline</h3>
                            <div className="space-y-0">
                                {[...order.trackingHistory].reverse().map((event, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {/* Timeline line */}
                                        {i < order.trackingHistory.length - 1 && (
                                            <div className="absolute left-[11px] top-8 w-0.5 h-full bg-gray-100" />
                                        )}
                                        {/* Dot */}
                                        <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 z-10 ${i === 0 ? "bg-pink-500" : "bg-gray-200"
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-gray-400"}`} />
                                        </div>
                                        {/* Content */}
                                        <div className="pb-6 flex-1">
                                            <p className={`text-xs font-black uppercase tracking-wider ${i === 0 ? "text-pink-600" : "text-gray-500"
                                                }`}>
                                                {event.status.replace(/_/g, " ")}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{event.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(event.timestamp).toLocaleString("en-PK", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
                        <h3 className="text-sm font-black text-gray-800 mb-4">Items in this Order</h3>
                        <div className="space-y-3">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{item.emoji || "🎁"}</span>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">{item.name}</p>
                                            <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-gray-700">Rs {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Hint when no search yet */}
            {!order && !error && !loading && (
                <div className="text-center text-gray-400 mt-8">
                    <p className="text-sm font-medium">Your order number is on your confirmation email & in{" "}
                        <Link href="/orders" className="text-pink-500 font-bold hover:underline">My Orders</Link>
                    </p>
                </div>
            )}
        </section>
    );
}

export default function TrackOrder() {
    return (
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-pink-500 font-bold">Loading tracker...</div>}>
            <TrackOrderContent />
        </Suspense>
    );
}
