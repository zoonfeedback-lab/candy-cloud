"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderHistory() {
    const { isAuthenticated, isLoading, authFetch, openAuthModal } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            openAuthModal("login");
            router.push("/");
            return;
        }
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, isLoading]);

    const fetchOrders = async () => {
        try {
            const res = await authFetch(`/api/orders`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        placed: "bg-blue-100 text-blue-700",
        processing: "bg-yellow-100 text-yellow-700",
        shipped: "bg-purple-100 text-purple-700",
        delivered: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const paymentStatusColors = {
        pending: "bg-orange-100 text-orange-700",
        paid: "bg-green-100 text-green-700",
        failed: "bg-red-100 text-red-700",
    };

    if (isLoading || loading) {
        return (
            <section className="min-h-[60vh] flex items-center justify-center">
                <div className="text-pink-500 font-bold text-lg animate-pulse">Loading your orders...</div>
            </section>
        );
    }

    return (
        <section className="py-16 px-5 max-w-[900px] mx-auto w-full">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">📦 My Orders</h1>
                <p className="text-gray-500 text-sm mt-2">Track your CandyCloud deliveries</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-6 opacity-80">📭</div>
                    <h2 className="text-2xl font-black text-gray-800 mb-4">No orders yet!</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start shopping and your order history will appear here.</p>
                    <Link href="/shop" className="px-8 py-3 rounded-full bg-pink-500 text-white font-bold shadow-lg hover:bg-pink-600 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Order</p>
                                    <p className="text-sm font-bold text-gray-700 font-mono">{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/track?q=${order.orderNumber || ''}`} className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors">
                                        Track
                                    </Link>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                                        {order.orderStatus}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${paymentStatusColors[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-2 mb-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-start justify-between text-sm">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span>{item.emoji || "🎁"}</span>
                                                <span className="font-medium text-gray-700">{item.name}</span>
                                                <span className="text-gray-400 text-xs">×{item.quantity}</span>
                                            </div>
                                            {item.description && (
                                                <span className="text-[10px] text-gray-500 font-medium ml-7 mt-0.5 line-clamp-1">
                                                    <span className="font-bold text-pink-500">Includes:</span> {item.description}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-bold text-gray-700">Rs {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex gap-4 text-xs text-gray-400">
                                    <span>💳 {order.paymentMethod?.toUpperCase()}</span>
                                    <span>📅 {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <span className="text-lg font-black text-pink-500">Rs {order.total?.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
