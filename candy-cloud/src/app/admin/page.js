"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
    const { user, authFetch, API_URL } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await authFetch(`${API_URL}/api/admin/dashboard`);
                const result = await res.json();
                if (result.success) {
                    setData(result);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === "admin") {
            fetchDashboardData();
        }
    }, [user, authFetch, API_URL]);

    if (loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-20 bg-gray-200 rounded-xl w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl w-full"></div>
                    <div className="h-96 bg-gray-200 rounded-2xl w-full"></div>
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-red-500 font-bold">Failed to load dashboard data.</div>;

    const { kpis, recentOrders, inventory, goldenScoopPanel } = data;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                    Good morning, {user?.name?.split(" ")[0]}! 🍦
                </h1>
                <p className="text-gray-500 font-medium">Here's what's happening at CandyCloud today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-orange-100/50 text-5xl font-black">💵</div>
                    <p className="text-sm font-bold text-gray-500 tracking-wide mb-2 uppercase">Total Sales</p>
                    <h2 className="text-3xl font-black text-gray-900 mb-2 relative z-10">${kpis.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        +12.5%
                    </p>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-pink-100/50 text-5xl font-black">🛍️</div>
                    <p className="text-sm font-bold text-gray-500 tracking-wide mb-2 uppercase">Total Orders</p>
                    <h2 className="text-3xl font-black text-gray-900 mb-2 relative z-10">{kpis.totalOrders.toLocaleString()}</h2>
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        +8.2%
                    </p>
                </div>

                {/* Avg Order Value */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-teal-100/50 text-5xl font-black">🧾</div>
                    <p className="text-sm font-bold text-gray-500 tracking-wide mb-2 uppercase">Avg Order Value</p>
                    <h2 className="text-3xl font-black text-gray-900 mb-2 relative z-10">${kpis.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        +2.1%
                    </p>
                </div>

                {/* Golden Scoops Found */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-yellow-100/50 text-6xl font-black">⭐</div>
                    <p className="text-sm font-bold text-gray-500 tracking-wide mb-2 uppercase">Golden Scoops Found</p>
                    <h2 className="text-3xl font-black text-gray-900 mb-2 relative z-10">{kpis.goldenScoopsFound}</h2>
                    <p className="text-xs font-bold text-orange-500 flex items-center gap-1">
                        🎉 Active Campaign
                    </p>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Orders (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>
                        <button className="text-orange-500 font-bold text-sm hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="pb-4">Order ID</th>
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                                    <tr key={order.id} className={i !== recentOrders.length - 1 ? "border-b border-gray-50" : ""}>
                                        <td className="py-4 font-bold text-gray-900 text-sm">{order.id}</td>
                                        <td className="py-4 font-medium text-gray-600 text-sm">{order.customerName}</td>
                                        <td className="py-4 font-medium text-gray-500 text-sm">
                                            {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                        <td className="py-4 font-black text-gray-900 text-sm">
                                            ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${order.status === "delivered" ? "bg-gray-100 text-gray-500" :
                                                    order.status === "placed" ? "bg-orange-100 text-orange-600" :
                                                        order.status === "shipped" || order.status === "out_for_delivery" ? "bg-teal-100 text-teal-700" :
                                                            "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " ")}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-400 font-medium">No recent orders.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Golden Scoop Panel */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">⭐</div>
                        <h3 className="text-xl font-black text-gray-900">Golden Scoop Panel</h3>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm text-gray-700">Win Probability</span>
                            <span className="font-black text-sm bg-gray-100 px-2.5 py-1 rounded-md text-gray-700">2.0%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "2%" }}></div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-8 mt-auto text-center">
                        <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Current Jackpot</p>
                        <h4 className="text-2xl font-black text-gray-900 mb-2">${goldenScoopPanel?.currentJackpot?.toFixed(2) || '500.00'} Store Credit</h4>
                        <p className="text-xs text-orange-600/80 font-medium">Remaining Scoops: {goldenScoopPanel?.scoopsRemaining ?? 0} / {goldenScoopPanel?.totalScoops ?? 60}</p>
                    </div>

                    <div className="mb-8">
                        <h4 className="font-bold text-sm text-gray-900 mb-3">Latest Winners</h4>
                        <div className="flex -space-x-3">
                            {goldenScoopPanel?.latestWinners && goldenScoopPanel.latestWinners.length > 0 ? (
                                <>
                                    {goldenScoopPanel.latestWinners.map((winner, idx) => {
                                        const bgColors = ["bg-pink-100 text-pink-600", "bg-teal-100 text-teal-600", "bg-orange-100 text-orange-600"];
                                        return (
                                            <div key={idx} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-black shadow-sm ${bgColors[idx % bgColors.length]}`} title={winner.name}>
                                                {winner.initials}
                                            </div>
                                        );
                                    })}
                                    {kpis.goldenScoopsFound > 3 && (
                                        <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-black text-orange-600">
                                            +{kpis.goldenScoopsFound - 3}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-gray-400 font-medium">No winners yet!</p>
                            )}
                        </div>
                    </div>

                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                        Update Settings
                    </button>
                </div>
            </div>

            {/* Inventory Status */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xl font-black text-gray-900">Inventory Status</h3>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                            Low Stock Alert
                        </button>
                        <button className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors">
                            Add Product
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Map through the actual inventory from DB */}
                    {inventory && inventory.length > 0 ? inventory.slice(0, 3).map((item, i) => {
                        const colors = ["border-pink-500", "border-teal-400", "border-orange-500"];
                        const bgColors = ["bg-pink-500", "bg-teal-400", "bg-orange-500"];
                        const textColors = ["text-pink-500", "text-teal-400", "text-orange-500"];
                        const progress = Math.min(100, (item.stock / 100) * 100);

                        return (
                            <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden relative">
                                <div className={`absolute bottom-0 left-0 h-1.5 ${bgColors[i]} w-full`} style={{ width: `${progress}%` }}></div>
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h4 className="font-black text-gray-900 text-lg">{item.name}</h4>
                                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mt-1">{item.category || 'PRODUCT'} &middot; Stock: {item.stock}</p>
                                    </div>
                                    <span className={`text-sm font-black ${textColors[i]}`}>
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="col-span-3 text-center py-8 text-gray-400 font-medium">No products in inventory yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
