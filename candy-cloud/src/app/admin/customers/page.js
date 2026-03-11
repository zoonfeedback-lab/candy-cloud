"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminCustomers() {
    const { user, authFetch, API_URL } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 15,
                search,
            });
            const res = await authFetch(`${API_URL}/api/admin/customers?${params}`);
            const result = await res.json();
            if (result.success) setData(result);
        } catch (err) {
            console.error("Failed to fetch customers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === "admin") {
            const t = setTimeout(() => fetchCustomers(), 300);
            return () => clearTimeout(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, currentPage, search]);

    // Helpers
    const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
    const getInitialsBg = (name) => {
        const colors = ["bg-pink-100 text-pink-600", "bg-blue-100 text-blue-600", "bg-purple-100 text-purple-600", "bg-green-100 text-green-600", "bg-pink-100 text-pink-600", "bg-teal-100 text-teal-600"];
        const i = (name || "").charCodeAt(0) % colors.length;
        return colors[i];
    };
    const timeAgo = (date) => {
        if (!date) return "—";
        const d = new Date(date);
        const diff = Date.now() - d.getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 30) return `${days}d ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    };

    if (!data && loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
        );
    }

    if (!data) return <div className="text-red-500 font-bold">Failed to load customer data.</div>;

    const { kpis, customers, pagination } = data;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            <h1 className="text-2xl font-black text-gray-900">Customers</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Total Customers</p>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">{kpis.totalCustomers}</h2>
                            <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                Active users
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border-[3px] border-white shadow-sm ring-1 ring-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Golden Scoop Winners</p>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">{kpis.goldenScoopWinners}</h2>
                            <p className="text-xs font-bold text-yellow-500 flex items-center gap-1">⭐ Lucky spinners</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 border-[3px] border-white shadow-sm ring-1 ring-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Avg Order Value</p>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Rs {kpis.avgOrderValue?.toLocaleString()}</h2>
                            <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <span className="inline-block w-2.5 h-[2px] bg-gray-400 rounded-full"></span>
                                Per transaction
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 border-[3px] border-white shadow-sm ring-1 ring-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 sm:p-8">

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] transition-all text-gray-700 shadow-sm"
                        />
                    </div>
                    <p className="text-sm text-gray-400 font-bold">{pagination.totalItems} customers</p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="pb-4 pt-2 pl-4">Customer</th>
                                <th className="pb-4 pt-2">Location</th>
                                <th className="pb-4 pt-2">Orders</th>
                                <th className="pb-4 pt-2">Total Spent</th>
                                <th className="pb-4 pt-2">Last Order</th>
                                <th className="pb-4 pt-2 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/80 relative">
                            {loading && (
                                <tr>
                                    <td colSpan="6">
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && customers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center text-gray-400 font-medium">
                                        No customers found.
                                    </td>
                                </tr>
                            )}

                            {customers.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-5 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${getInitialsBg(c.name)}`}>
                                                {getInitials(c.name)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                                                    {c.isGoldenScoop && (
                                                        <span title="Golden Scoop Winner" className="text-[9px] font-black text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full border border-yellow-200">⭐</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 font-medium">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className="text-sm text-gray-600 font-medium">{c.location}</span>
                                    </td>
                                    <td className="py-5">
                                        <span className="font-black text-gray-900 text-sm">{c.totalOrders}</span>
                                    </td>
                                    <td className="py-5">
                                        <span className="font-black text-gray-900 text-sm">Rs {c.totalSpent.toLocaleString()}</span>
                                    </td>
                                    <td className="py-5">
                                        <span className="text-sm text-gray-500 font-medium">{timeAgo(c.lastOrderDate)}</span>
                                    </td>
                                    <td className="py-5 text-right pr-4">
                                        <Link
                                            href={`/admin/customers/${c.id}`}
                                            className="text-gray-400 hover:text-[#ec4899] w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-pink-50 transition-colors"
                                            title="View Profile"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-100 gap-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">
                            {customers.length > 0 ? ((pagination.currentPage - 1) * 15) + 1 : 0}
                            -{Math.min(pagination.currentPage * 15, pagination.totalItems)}
                        </span> of <span className="font-bold text-gray-900">{pagination.totalItems}</span> customers
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
