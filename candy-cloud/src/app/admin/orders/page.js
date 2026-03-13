"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminOrders() {
    const { user, authFetch } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters & Pagination state
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                search: search,
                status: statusFilter
            });

            const res = await authFetch(`/api/admin/orders?${queryParams}`);
            const result = await res.json();
            if (result.success) {
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch admin orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch when page or filter state changes 
    // (Note: we use a manual 'Apply Filters' button per the mockup, so we might want to decouple search string from the fetch trigger)
    useEffect(() => {
        if (user && user.role === "admin") {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, currentPage]);

    const handleApplyFilters = () => {
        setCurrentPage(1); // Reset to page 1 on new filter
        fetchOrders();
    };

    if (!data && loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>)}
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl w-full"></div>
            </div>
        );
    }

    if (!data) return <div className="text-red-500 font-bold">Failed to load orders data.</div>;

    const { kpis, orders, pagination } = data;

    // Helper to render the status pill
    const renderStatusBadge = (statusStr) => {
        let label = statusStr;
        let styleStr = "bg-gray-100 text-gray-500"; // default

        if (statusStr === "placed" || statusStr === "processing" || statusStr === "Sorting") {
            label = "Sorting";
            styleStr = "bg-[#fff0db] text-[#d97706]"; // Yellow/Pink
        } else if (statusStr === "shipped" || statusStr === "out_for_delivery" || statusStr === "Stork Transit") {
            label = "Stork Transit";
            styleStr = "bg-[#e0f2fe] text-[#0369a1]"; // Blue
        } else if (statusStr === "delivered" || statusStr === "Delivered") {
            label = "Delivered";
            styleStr = "bg-[#dcfce7] text-[#15803d]"; // Green
        } else if (statusStr === "cancelled" || statusStr === "Magic Fail") {
            label = "Magic Fail";
            styleStr = "bg-[#fce7f3] text-[#be185d]"; // Pink/Red
        }

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${styleStr}`}>
                {label}
            </span>
        );
    };

    // Helper to generate a background color for initials
    const getInitialsBg = (name) => {
        const colors = ["bg-pink-100 text-pink-600", "bg-teal-100 text-teal-600", "bg-pink-100 text-pink-600", "bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600"];
        const index = name.length % colors.length;
        return colors[index];
    };

    // Helper to get initials
    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            {/* Breadcrumbs */}
            <div className="flex items-center text-sm font-bold">
                <span className="text-gray-400">Dashboard</span>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-gray-900">Orders</span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        </div>
                        <span className="text-xs font-black text-teal-500 bg-teal-50 px-2.5 py-1 rounded-full">+8.2%</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Total Orders</p>
                    <h2 className="text-3xl font-black text-gray-900">{kpis.totalOrders.toLocaleString()}</h2>
                </div>

                {/* Pending Sorting */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Pending Sorting</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-black text-gray-900">{kpis.pendingSorting}</h2>
                        <span className="text-sm font-bold text-gray-500">boxes</span>
                    </div>
                </div>

                {/* In Stork Transit */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">In Stork Transit</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-black text-gray-900">{kpis.inTransit}</h2>
                        <span className="text-sm font-bold text-gray-500">deliveries</span>
                    </div>
                </div>

                {/* Golden Scoop Orders */}
                <div className="bg-[#fff9f0] rounded-2xl p-6 shadow-sm border border-[#fce9c0] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-pink-400 flex items-center justify-center text-white shadow-sm shadow-pink-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                        </div>
                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Premium</span>
                    </div>
                    <p className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-widest relative z-10">Golden Scoop Orders</p>
                    <div className="flex items-baseline gap-2 relative z-10">
                        <h2 className="text-3xl font-black text-gray-900">{kpis.goldenScoopOrders}</h2>
                        <span className="text-sm font-bold text-gray-600">active</span>
                    </div>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">

                {/* Toolbar */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
                    <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>

                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search ID or Customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all text-gray-700"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-gray-700 appearance-none min-w-[140px]"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Sorting">Sorting</option>
                            <option value="Stork Transit">Stork Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Magic Fail">Magic Fail</option>
                        </select>

                        {/* Mock Date Picker for styling */}
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="mm/dd/yyyy"
                                disabled
                                className="bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-gray-400 w-36 pr-10 cursor-not-allowed hidden md:block"
                            />
                            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>

                        <button
                            onClick={handleApplyFilters}
                            className="bg-[#ec4899] hover:bg-[#be185d] text-white rounded-xl py-2.5 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="pb-4 pt-2 font-black pl-2">Order ID</th>
                                <th className="pb-4 pt-2 font-black">Customer Name</th>
                                <th className="pb-4 pt-2 font-black">Date</th>
                                <th className="pb-4 pt-2 font-black">Items</th>
                                <th className="pb-4 pt-2 font-black">Amount</th>
                                <th className="pb-4 pt-2 font-black">Status</th>
                                <th className="pb-4 pt-2 font-black text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/80 relative">
                            {loading && (
                                <tr>
                                    <td colSpan="7">
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && orders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-16 text-center text-gray-400 font-medium">
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            )}

                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 pl-2">
                                        <Link href={`/admin/orders/${order._id}`} className="font-bold text-[#ec4899] hover:text-[#be185d] hover:underline transition-colors text-sm">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </Link>
                                        {/* Show golden scoop badge next to ID if applicable */}
                                        {order.isGoldenScoop && (
                                            <span title="Golden Scoop Order" className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-100 text-yellow-600 text-[10px]">⭐</span>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${getInitialsBg(order.customerName)}`}>
                                                {getInitials(order.customerName)}
                                            </div>
                                            <span className="font-bold text-gray-800 text-sm">{order.customerName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 font-medium text-gray-500 text-sm">
                                        {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="py-4 text-sm text-gray-600 font-medium truncate max-w-[200px]">
                                        {order.itemsSummary}
                                    </td>
                                    <td className="py-4 font-black text-gray-900 text-sm">
                                        Rs {order.amount.toLocaleString()}
                                    </td>
                                    <td className="py-4">
                                        {renderStatusBadge(order.status)}
                                    </td>
                                    <td className="py-4 text-right pr-4">
                                        <Link href={`/admin/orders/${order._id}`} title="View Order Details" className="text-gray-400 hover:text-[#ec4899] w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-pink-50 transition-colors ml-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-100 gap-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">
                            {orders.length > 0 ? ((pagination.currentPage - 1) * 10) + 1 : 0}
                            -{Math.min(pagination.currentPage * 10, pagination.totalOrders)}
                        </span> of <span className="font-bold text-gray-900">{pagination.totalOrders.toLocaleString()}</span> orders
                    </p>

                    <div className="flex gap-1.5">
                        <button
                            disabled={pagination?.currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>

                        {/* Mock Pages for visual accuracy to mockup */}
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-transparent bg-pink-500 text-white font-bold shadow-sm">
                            {pagination?.currentPage || 1}
                        </button>

                        {pagination?.totalPages > 1 && pagination?.currentPage < pagination?.totalPages && (
                            <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center border border-transparent text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                            >
                                {pagination.currentPage + 1}
                            </button>
                        )}

                        {pagination?.totalPages > 2 && pagination?.currentPage + 1 < pagination?.totalPages && (
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold tracking-widest">
                                ...
                            </div>
                        )}

                        {pagination?.totalPages > 2 && pagination?.currentPage + 1 < pagination?.totalPages && (
                            <button
                                onClick={() => setCurrentPage(pagination.totalPages)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center border border-transparent text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                            >
                                {pagination.totalPages}
                            </button>
                        )}

                        <button
                            disabled={pagination?.currentPage >= pagination?.totalPages || !pagination?.totalPages}
                            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}
