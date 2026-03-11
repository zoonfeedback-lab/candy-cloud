"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminCustomerDetail() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id;
    const { user, authFetch, API_URL } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            if (!user || user.role !== "admin") return;

            try {
                const res = await authFetch(`${API_URL}/api/admin/customers/${customerId}`);
                const result = await res.json();

                if (result.success) {
                    setData(result);
                } else {
                    setError(result.error || "Failed to load customer details");
                }
            } catch (err) {
                console.error("Error fetching customer:", err);
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerDetails();
    }, [user, customerId, authFetch, API_URL]);

    if (loading) {
        return (
            <div className="animate-pulse space-y-8 max-w-7xl mx-auto pb-12">
                <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl w-full"></div>)}
                </div>
                <div className="flex gap-8">
                    <div className="flex-1 h-96 bg-gray-200 rounded-2xl"></div>
                    <div className="w-80 h-96 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-7xl mx-auto text-center py-20">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Customer Not Found</h2>
                <p className="text-gray-500 mb-6">{error || "The customer you are looking for does not exist."}</p>
                <button onClick={() => router.push('/admin/customers')} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                    Back to Customers
                </button>
            </div>
        );
    }

    const { profile, kpis, orders, journey } = data;

    // Helper for initials
    const getInitials = (name) => {
        if (!name) return "US";
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    // Helper for Status Badge
    const renderStatusBadge = (statusStr) => {
        let label = statusStr;
        let styleStr = "bg-gray-100 text-gray-500";

        if (statusStr === "placed" || statusStr === "processing" || statusStr === "Sorting") {
            label = "Sorting";
            styleStr = "bg-[#fff0db] text-[#d97706]";
        } else if (statusStr === "shipped" || statusStr === "out_for_delivery" || statusStr === "Stork Transit") {
            label = "Stork Transit";
            styleStr = "bg-[#e0f2fe] text-[#0369a1]";
        } else if (statusStr === "delivered" || statusStr === "Delivered") {
            label = "Delivered";
            styleStr = "bg-[#dcfce7] text-[#15803d]";
        } else if (statusStr === "cancelled" || statusStr === "Magic Fail") {
            label = "Magic Fail";
            styleStr = "bg-[#fce7f3] text-[#be185d]";
        }

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-wide uppercase ${styleStr}`}>
                {label}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">

            {/* Breadcrumb Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-sm font-bold">
                    <Link href="/admin/customers" className="text-gray-400 hover:text-gray-600 transition-colors">Customers</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-900">{profile.name}</span>
                </div>
                <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="bg-gray-50 border border-gray-100/0 focus:border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-0 transition-all text-gray-700 w-64"
                    />
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    {/* Avatar Bubble */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-pink-100 border-4 border-pink-50 flex items-center justify-center text-pink-500 text-3xl font-black shadow-inner shrink-0 overflow-hidden relative">
                        {/* Fallback to initials if no actual image logic exists */}
                        <span className="z-10 relative">{getInitials(profile.name)}</span>
                        {/* Optional subtle gradient background inside the bubble to mimic the soft picture feel */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/40 to-pink-200/40 z-0"></div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{profile.name}</h1>
                            {profile.isGoldenScoopWinner && (
                                <span className="inline-flex flex-shrink-0 items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff9f0] border border-[#fce9c0] text-pink-500 text-[11px] font-black uppercase tracking-widest leading-none">
                                    ⭐ Golden Scoop Winner
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm font-medium text-gray-500 mb-2">
                            <span className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><polyline points="3 7 12 13 21 7"></polyline></svg>
                                {profile.email}
                            </span>
                            <span className="flex items-center gap-1.5 hidden sm:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                {profile.phone}
                            </span>
                        </div>

                        <div className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <span>Customer since {new Date(profile.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="text-gray-300" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path></svg>
                                {profile.location}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <button className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border-2 border-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                        Edit Profile
                    </button>
                    <button className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#ec4899] hover:bg-[#be185d] text-white font-bold text-sm transition-colors shadow-sm">
                        Send Magic Note
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Total Spent</p>
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                            ${kpis.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%↗</span>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Orders</p>
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{kpis.totalOrders}</h2>
                        <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+2%↗</span>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Avg. Order Value</p>
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                            ${kpis.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+5%↗</span>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="text-pink-400" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        Magic Points
                    </p>
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{kpis.magicPoints.toLocaleString()}</h2>
                        <span className="text-[10px] font-black text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">+500✨</span>
                    </div>
                </div>
            </div>

            {/* Layout Grid for Tables & Sidebars */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Main Content Area (Orders) */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-lg font-black text-gray-900">Order History</h3>
                        <a href="#" className="text-[#ec4899] text-sm font-bold hover:underline">View All</a>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/30">
                                        <th className="pb-4 pt-5 pl-6">Order ID</th>
                                        <th className="pb-4 pt-5">Date</th>
                                        <th className="pb-4 pt-5">Amount</th>
                                        <th className="pb-4 pt-5 pr-6 text-right w-[140px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50/80">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">No orders found for this customer.</td>
                                        </tr>
                                    ) : orders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 pl-6">
                                                <span className="font-bold text-gray-700 text-sm">#{order.id.slice(-6).toUpperCase()}</span>
                                            </td>
                                            <td className="py-4 font-medium text-gray-500 text-sm">
                                                {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td className="py-4 font-black text-gray-900 text-sm">
                                                ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-4 pr-6 text-right">
                                                {renderStatusBadge(order.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Area (Journey & Quick Actions) */}
                <div className="w-full lg:w-[340px] shrink-0 space-y-8">

                    {/* Magic Journey Timeline */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-pink-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h-1v1"></path><path d="M22 22v-1h-1"></path><path d="M2 19h1v1"></path><path d="M22 5h1v-1"></path><path d="m9 21 6-6"></path><path d="m8 9 6 6"></path><path d="m15 15 6-6 3-2"></path></svg>
                            </span>
                            <h3 className="text-lg font-black text-gray-900">Magic Journey</h3>
                        </div>

                        <div className="pl-3 relative pt-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-6 bottom-4 w-0.5 bg-gray-100 rounded-full"></div>

                            <div className="space-y-6">
                                {journey.map((item, id) => (
                                    <div key={item.id} className="relative pl-8 bg-transparent">
                                        {/* Dot */}
                                        <div className={`absolute left-[-2px] top-1 w-3 h-3 rounded-full border-2 bg-white ${id === 0 ? "border-pink-500" : "border-gray-300"}`}></div>

                                        <h4 className={`text-sm font-black leading-tight ${id === 0 ? "text-gray-900" : "text-gray-600"}`}>{item.title}</h4>
                                        <p className="text-xs font-medium text-gray-400 mt-1 mb-1">{item.description}</p>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                            {new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="bg-[#fff9f0] rounded-3xl p-6 border border-[#fce9c0]">
                        <h3 className="text-[11px] font-black text-pink-600 uppercase tracking-widest mb-4">Admin Quick Actions</h3>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between bg-white text-gray-700 hover:text-gray-900 hover:shadow-md transition-shadow font-bold text-sm px-5 py-3.5 rounded-2xl border border-gray-100 group">
                                Issue Refund
                                <svg className="text-gray-400 group-hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </button>

                            <button className="w-full flex items-center justify-between bg-white text-gray-700 hover:text-gray-900 hover:shadow-md transition-shadow font-bold text-sm px-5 py-3.5 rounded-2xl border border-gray-100 group">
                                Update Loyalty Status
                                <svg className="text-gray-400 group-hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            </button>

                            <button className="w-full flex items-center justify-between bg-white text-red-500 hover:text-red-600 hover:shadow-md transition-shadow font-bold text-sm px-5 py-3.5 rounded-2xl border border-red-100 group mt-4">
                                Flag Account
                                <svg className="text-red-400 group-hover:text-red-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
