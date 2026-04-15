"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const STATUS_FLOW = [
    { key: "placed", label: "Placed", emoji: "📦", color: "bg-blue-500" },
    { key: "confirmed", label: "Confirmed", emoji: "✅", color: "bg-teal-500" },
    { key: "processing", label: "Processing", emoji: "⚙️", color: "bg-yellow-500" },
    { key: "shipped", label: "Shipped", emoji: "🚚", color: "bg-purple-500" },
    { key: "out_for_delivery", label: "Out for Delivery", emoji: "🏃", color: "bg-pink-500" },
    { key: "delivered", label: "Delivered", emoji: "🎉", color: "bg-green-500" },
];

export default function AdminOrderDetail() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;
    const { user, authFetch } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Status update state
    const [newStatus, setNewStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [updating, setUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const fetchOrder = async () => {
        try {
            const res = await authFetch(`/api/orders/${orderId}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
                setNewStatus("");
            } else {
                setError(data.message || "Failed to load order.");
            }
        } catch (err) {
            console.error("Error fetching order:", err);
            setError("An error occurred while fetching order data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === "admin") {
            fetchOrder();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, orderId]);

    const handleStatusUpdate = async () => {
        if (!newStatus) return;
        setUpdating(true);
        setUpdateSuccess(false);

        try {
            const res = await authFetch(`/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    message: statusMessage || undefined,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
                setNewStatus("");
                setStatusMessage("");
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
            } else {
                alert(data.message || "Failed to update status.");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Network error updating status.");
        } finally {
            setUpdating(false);
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="animate-pulse space-y-8 max-w-7xl mx-auto pb-12">
                <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="h-48 bg-gray-200 rounded-2xl w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-5xl mx-auto text-center py-20">
                <div className="text-4xl mb-4">😔</div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-6">{error || "This order does not exist."}</p>
                <button onClick={() => router.push("/admin/orders")} className="bg-[#ec4899] hover:bg-[#be185d] text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                    Back to Orders
                </button>
            </div>
        );
    }

    const isCancelled = order.orderStatus === "cancelled";
    const isDelivered = order.orderStatus === "delivered";
    const isFinal = isCancelled || isDelivered;
    const currentStepIndex = isCancelled ? -1 : STATUS_FLOW.findIndex(s => s.key === order.orderStatus);

    // Only show forward statuses + cancel option
    const availableStatuses = isFinal
        ? []
        : STATUS_FLOW.filter((_, i) => i > currentStepIndex).concat(
            [{ key: "cancelled", label: "Cancelled", emoji: "❌", color: "bg-red-500" }]
        );

    const customerName = order.shippingAddress?.firstName
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        : (order.user?.name || "Unknown");

    const getStatusStyle = (status) => {
        const map = {
            placed: "bg-blue-50 text-blue-600 border-blue-200",
            confirmed: "bg-teal-50 text-teal-600 border-teal-200",
            processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
            shipped: "bg-purple-50 text-purple-600 border-purple-200",
            out_for_delivery: "bg-pink-50 text-pink-600 border-pink-200",
            delivered: "bg-green-50 text-green-600 border-green-200",
            cancelled: "bg-red-50 text-red-600 border-red-200",
        };
        return map[status] || "bg-gray-50 text-gray-600 border-gray-200";
    };

    const getInitials = (name) => {
        if (!name) return "US";
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {/* Top Bar / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pb-6 border-b border-gray-100">
                <div className="flex items-center text-sm font-bold">
                    <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">Dashboard</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600 transition-colors">Orders</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-900">#{order.orderNumber}</span>
                </div>
            </div>

            {/* Header Actions & Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-black text-gray-900">Order #{order.orderNumber}</h1>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.orderStatus)}`}>
                            {order.orderStatus.replace(/_/g, " ")}
                        </span>
                        {order.couponCode && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-[#d97706] text-[10px] font-black tracking-widest uppercase rounded-full border border-yellow-200">
                                ⭐ Golden Scoop
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => router.push("/admin/orders")}
                        className="px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Back to Orders
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Side (2/3 width) - Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Status Stepper Card */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-gray-700 font-bold">Current Status: <span className="text-[#ec4899] ml-1">{order.orderStatus.replace(/_/g, " ")}</span></h3>
                            {order.estimatedDelivery && (
                                <span className="text-xs font-medium text-gray-400 text-right">
                                    Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                            )}
                        </div>

                        {isCancelled ? (
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
                                <div className="text-3xl mb-2">❌</div>
                                <p className="text-red-600 font-black text-lg">Order Cancelled</p>
                                <p className="text-red-400 text-xs mt-1">
                                    {order.trackingHistory?.find(e => e.status === "cancelled")?.message || "This order has been cancelled"}
                                </p>
                            </div>
                        ) : (
                            <div className="relative flex justify-between">
                                <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full z-0 -translate-y-1/2"></div>
                                <div
                                    className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full z-0 -translate-y-1/2 transition-all duration-700"
                                    style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_FLOW.length - 1)) * 100)}%` }}
                                ></div>

                                {STATUS_FLOW.map((step, i) => {
                                    const isComplete = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;
                                    return (
                                        <div key={step.key} className="relative z-10 flex flex-col items-center gap-3 w-1/6">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 shadow-sm ${
                                                isCurrent
                                                    ? `${step.color} text-white ring-4 ring-opacity-30 ring-gray-300 scale-110`
                                                    : isComplete
                                                        ? `bg-green-500 text-white`
                                                        : "bg-white border-2 border-gray-200 text-gray-400"
                                            }`}>
                                                {isComplete && !isCurrent ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                ) : (
                                                    <span className="text-lg">{step.emoji}</span>
                                                )}
                                            </div>
                                            <span className={`text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-center leading-tight ${
                                                isCurrent ? "text-[#ec4899]" : isComplete ? "text-gray-700" : "text-gray-400"
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Three Cards Layout: Customer, Shipping, Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        {/* Customer Info Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-black text-sm">
                                    {getInitials(customerName)}
                                </div>
                                <h3 className="font-bold text-gray-900 text-[15px]">Customer</h3>
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <p className="font-bold text-gray-900 text-sm">{customerName}</p>
                                {order.user?.email && <p className="text-xs text-gray-500 font-medium truncate">{order.user.email}</p>}
                                {order.shippingAddress?.phone && <p className="text-xs text-gray-500 font-medium">{order.shippingAddress.phone}</p>}
                            </div>
                        </div>

                        {/* Shipping Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" /></svg>
                                </div>
                                <h3 className="font-bold text-gray-900 text-[15px]">Shipping</h3>
                            </div>
                            {order.shippingAddress ? (
                                <div className="space-y-1 text-xs text-gray-500 font-medium flex-1">
                                    <p className="font-bold text-gray-900 text-sm mb-2">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                    {order.shippingAddress.address && <p>{order.shippingAddress.address}</p>}
                                    <p>{[order.shippingAddress.city, order.shippingAddress.zipCode].filter(Boolean).join(", ")}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">No address on file</p>
                            )}
                        </div>

                        {/* Payment Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                </div>
                                <h3 className="font-bold text-gray-900 text-[15px]">Payment</h3>
                            </div>
                            <div className="space-y-3 flex-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Method</span>
                                    <span className="text-gray-700 font-bold">{order.paymentMethod?.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Amount</span>
                                    <span className="text-gray-900 font-black">Rs {order.total?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Status</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        order.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-pink-100 text-pink-600"
                                    }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Items Scooped Table */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 sm:p-8 flex justify-between items-center border-b border-gray-50 bg-white">
                            <h3 className="text-lg font-black text-gray-900">Items Scooped</h3>
                            <span className="text-xs font-bold text-pink-500">{order.items?.length || 0} Items</span>
                        </div>

                        <div className="overflow-x-auto w-full border-b border-gray-100">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                        <th className="py-4 pl-8">Item Details</th>
                                        <th className="py-4 text-center">Qty</th>
                                        <th className="py-4 text-right">Unit Price</th>
                                        <th className="py-4 pr-8 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items?.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="py-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl">
                                                        {item.emoji || "🎁"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm mb-0.5">{item.name}</p>
                                                        {item.description && (
                                                            <p className="max-w-md text-xs text-gray-500 leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 text-gray-600 font-medium text-sm text-center">x {item.quantity}</td>
                                            <td className="py-5 text-gray-500 font-medium text-sm text-right">Rs {item.price?.toLocaleString()}</td>
                                            <td className="py-5 pr-8 text-gray-900 font-black text-sm text-right">Rs {(item.price * item.quantity)?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="w-full bg-white flex flex-col items-end p-6 sm:px-8 space-y-2">
                            <div className="w-full max-w-[300px] flex justify-between items-center">
                                <span className="text-gray-500 font-bold text-sm">Subtotal</span>
                                <span className="text-gray-900 font-black text-sm">Rs {order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="w-full max-w-[300px] flex justify-between items-center">
                                <span className="text-gray-500 font-bold text-sm">Shipping</span>
                                <span className="text-gray-900 font-black text-sm">Rs {order.shippingCost?.toLocaleString()}</span>
                            </div>
                            {order.discountAmt > 0 && (
                                <div className="w-full max-w-[300px] flex justify-between items-center">
                                    <span className="text-gray-500 font-bold text-sm">Discount {order.couponCode && <span className="text-pink-500">({order.couponCode})</span>}</span>
                                    <span className="text-green-600 font-black text-sm">-Rs {order.discountAmt?.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="w-full bg-gray-50/80 border-t border-gray-100 flex justify-end items-center px-6 sm:px-8 py-5">
                            <div className="w-full max-w-[300px] flex justify-between items-center">
                                <span className="text-gray-900 font-black text-lg">Grand Total</span>
                                <span className="text-[#ec4899] font-black text-2xl">Rs {order.total?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Sidebar (1/3 width) */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Status Update Panel */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" /><path d="M8 18h1" /><path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z" /></svg>
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Update Status</h3>
                        </div>

                        {isFinal ? (
                            <div className="flex flex-col items-center justify-center text-center py-6">
                                <div className="text-4xl mb-3">{isDelivered ? "🎉" : "❌"}</div>
                                <p className="text-sm font-bold text-gray-500">
                                    This order is <span className="font-black text-gray-900">{order.orderStatus.replace(/_/g, " ")}</span> and cannot be updated.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">New Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-gray-700 appearance-none"
                                    >
                                        <option value="">Select next status...</option>
                                        {availableStatuses.map(s => (
                                            <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Message (Optional)</label>
                                    <textarea
                                        value={statusMessage}
                                        onChange={(e) => setStatusMessage(e.target.value)}
                                        placeholder="e.g. Packed with extra care! 💖"
                                        rows={3}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-gray-700 resize-none placeholder:text-gray-300"
                                    />
                                </div>

                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={!newStatus || updating}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                        !newStatus || updating
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-[#ec4899] hover:bg-[#be185d] text-white shadow-sm shadow-pink-200"
                                    }`}
                                >
                                    {updating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Apply Update
                                        </>
                                    )}
                                </button>

                                {updateSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center animate-in fade-in duration-300">
                                        <p className="text-sm font-bold text-green-600">✅ Status updated!</p>
                                        <p className="text-[10px] text-green-500 mt-1">Customer can see this change immediately.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tracking Timeline */}
                    <div className="bg-[#fffdfa] rounded-3xl p-6 sm:p-8 border border-[#fef3c7] shadow-sm sticky top-6">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Magic History</h3>
                        </div>

                        {order.trackingHistory && order.trackingHistory.length > 0 ? (
                            <div className="relative border-l-2 border-pink-100 ml-4 space-y-8 pb-4">
                                {[...order.trackingHistory].reverse().map((event, i) => (
                                    <div key={i} className="relative pl-6">
                                        {i === 0 ? (
                                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white ring-2 ring-pink-100"></div>
                                        ) : (
                                            <div className="absolute -left-[4px] top-1.5 w-1.5 h-1.5 bg-pink-300 rounded-full"></div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-[13px] leading-snug mb-1 capitalize">
                                                {event.status.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-gray-500 text-xs font-medium mb-3 leading-snug">
                                                {event.message}
                                            </span>
                                            <span className={`inline-block w-max px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                                i === 0 ? "bg-blue-50 text-[#3b82f6]" : "bg-gray-100 text-gray-400"
                                            }`}>
                                                {new Date(event.timestamp).toLocaleString("en-US", {
                                                    day: "numeric", month: "short",
                                                    hour: "2-digit", minute: "2-digit"
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 font-medium ml-4">No tracking events yet.</p>
                        )}
                    </div>

                </div>

            </div>

        </div>
    );
}
