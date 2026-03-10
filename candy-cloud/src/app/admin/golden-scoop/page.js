"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminGoldenScoop() {
    const { user, authFetch, API_URL } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScoopData = async () => {
            if (!user || user.role !== "admin") return;
            try {
                const res = await authFetch(`${API_URL}/api/admin/golden-scoop`);
                const result = await res.json();
                if (result.success) {
                    setData(result);
                }
            } catch (error) {
                console.error("Failed to fetch golden scoop data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScoopData();
    }, [user, authFetch, API_URL]);

    if (!data && loading) {
        return (
            <div className="animate-pulse space-y-8 max-w-7xl mx-auto pb-12">
                <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl w-full"></div>)}
                </div>
                <div className="flex gap-8">
                    <div className="flex-[2] h-96 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1 h-96 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (!data && !loading) {
        return <div className="text-red-500 font-bold p-8">Failed to load Golden Scoop data.</div>;
    }

    const { campaign, winners, chartData, stats } = data;

    // Helper to render initials for table
    const getInitials = (name) => {
        if (!name) return "US";
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    // Calculate max value for chart to set relative heights
    const maxChartValue = Math.max(...Object.values(chartData)) || 100;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 pr-4 sm:pr-8">

            {/* Breadcrumb & Header Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center text-sm font-bold text-gray-400 mb-2">
                        <span>Dashboard</span>
                        <span className="mx-2 text-gray-300">/</span>
                        <span>Marketing</span>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-gray-900">Golden Scoop</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Golden Scoop Management</h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-500 text-xs font-black uppercase tracking-widest leading-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                            Live Campaign
                        </span>
                    </div>
                    <p className="text-gray-500 mt-2 max-w-2xl font-medium">
                        Oversee the golden ticket distribution and track lucky winners across all locations.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <button className="flex-1 md:flex-none px-5 py-3 rounded-xl border-2 border-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export Report
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm transition-colors shadow-sm shadow-orange-200 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                        Edit Campaign Details
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Campaign Status */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-44">
                    <div>
                        <p className="text-[11px] font-black text-gray-400 mb-1 uppercase tracking-widest">Campaign Status</p>
                        <h2 className="text-2xl font-black text-gray-900">Currently Active</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Fake Toggle */}
                        <div className="w-12 h-6 bg-orange-500 rounded-full relative cursor-pointer flex items-center px-1">
                            <div className="w-4 h-4 rounded-full bg-white absolute right-1"></div>
                        </div>
                        <span className="text-sm font-bold text-gray-600">Pause Rewards</span>
                    </div>
                </div>

                {/* Win Probability */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-44">
                    <div>
                        <p className="text-[11px] font-black text-gray-400 mb-1 uppercase tracking-widest">Win Probability</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl font-black text-orange-500">{campaign.winProbability.toFixed(1)}%</h2>
                            <span className="text-xs font-bold text-gray-400">1 in 50 orders</span>
                        </div>
                    </div>
                    {/* Mock interactive slider */}
                    <div className="relative pt-4">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full"></div>
                        <div className="absolute top-4 left-[20%] w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow -translate-y-[5px] -translate-x-[50%]"></div>
                    </div>
                </div>

                {/* Scoops Remaining */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-44">
                    <div>
                        <p className="text-[11px] font-black text-gray-400 mb-1 uppercase tracking-widest">Scoops Remaining</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl font-black text-gray-900">{campaign.scoopsRemaining}</h2>
                            <span className="text-xs font-bold text-gray-400">/ {campaign.totalScoops} total</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-yellow-400" style={{ width: `${(campaign.scoopsRemaining / campaign.totalScoops) * 100}%` }}></div>
                    </div>
                </div>

                {/* Current Jackpot */}
                <div className="bg-[#fad643] rounded-[24px] p-6 shadow-inner border border-yellow-300 relative overflow-hidden h-44 flex flex-col justify-between">
                    {/* Decorative blur */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>

                    <div className="relative z-10">
                        <p className="text-[11px] font-black text-yellow-800 mb-1 uppercase tracking-widest">Current Jackpot</p>
                        <h2 className="text-3xl font-black text-gray-900 leading-none mb-1">
                            ${campaign.currentJackpot.toFixed(2)}
                        </h2>
                        <span className="text-xs font-bold text-yellow-800">Store Credit Reward</span>
                    </div>

                    {/* Mock Avatar Stack */}
                    <div className="flex -space-x-2 relative z-10 mt-auto">
                        <div className="w-7 h-7 rounded-full bg-white border-2 border-[#fad643] flex items-center justify-center text-[8px] font-black text-gray-600 shadow-sm">JD</div>
                        <div className="w-7 h-7 rounded-full bg-orange-100 border-2 border-[#fad643] flex items-center justify-center text-[8px] font-black text-orange-600 shadow-sm">AS</div>
                        <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-[#fad643] flex items-center justify-center text-[8px] font-black text-blue-600 shadow-sm">MK</div>
                    </div>
                </div>
            </div>

            {/* Main Content Split Area */}
            <div className="flex flex-col xl:flex-row gap-8">

                {/* Winners Table */}
                <div className="flex-[2_2_70%] bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col">
                    <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100">
                        <h3 className="text-xl font-black text-gray-900">Golden Scoop Winners</h3>
                        <button className="text-[#ea580c] font-bold text-sm hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                    <th className="pb-4 pt-5 pl-8">Date</th>
                                    <th className="pb-4 pt-5">Customer</th>
                                    <th className="pb-4 pt-5">Order ID</th>
                                    <th className="pb-4 pt-5">Reward</th>
                                    <th className="pb-4 pt-5 text-right pr-8">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/80">
                                {winners.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center text-gray-400 font-medium">No absolute winners found yet!</td>
                                    </tr>
                                )}

                                {winners.map((winner, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-5 pl-8">
                                            <div className="text-gray-500 font-medium text-sm">
                                                {new Date(winner.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })},<br />
                                                {new Date(winner.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[10px] font-black shadow-sm">
                                                    {getInitials(winner.customerName)}
                                                </div>
                                                <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{winner.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-gray-400 font-medium text-sm">{winner.orderId}</span>
                                        </td>
                                        <td className="py-5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fff9f0] text-orange-500 text-xs font-bold whitespace-nowrap">
                                                ⭐ {winner.reward}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right pr-8">
                                            <button className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors ml-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Analytics Area */}
                <div className="flex-[1_1_30%] bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col min-w-[300px]">
                    <div className="p-6 md:p-8">
                        <h3 className="text-xl font-black text-gray-900 mb-8">Find Rate History</h3>

                        {/* Bar Chart Mockup Area */}
                        <div className="h-44 flex items-end justify-between gap-2 border-b-2 border-gray-100 pb-2 mb-4 relative px-1">
                            {/* Horizontal guiding lines */}
                            <div className="absolute w-full border-b border-gray-50 top-[25%] left-0"></div>
                            <div className="absolute w-full border-b border-gray-50 top-[50%] left-0"></div>
                            <div className="absolute w-full border-b border-gray-50 top-[75%] left-0"></div>

                            {Object.keys(chartData).map(day => {
                                const value = chartData[day];
                                const heightPercent = (value / maxChartValue) * 100;
                                const isSaturday = day === "SAT"; // Mocking the highlighted orange bar

                                return (
                                    <div key={day} className="flex flex-col items-center gap-2 group w-full relative z-10">
                                        {/* Tooltip on hover */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap">
                                            {value} finds
                                        </div>
                                        {/* Bar */}
                                        <div
                                            className={`w-full max-w-[24px] rounded-t-lg transition-colors ${isSaturday ? "bg-[#ea580c]" : "bg-orange-100 group-hover:bg-orange-200"}`}
                                            style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                                        ></div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* X-Axis Labels */}
                        <div className="flex justify-between items-center px-1 mb-8">
                            {Object.keys(chartData).map(day => (
                                <span key={day} className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                            ))}
                        </div>

                        {/* Bottom Summary Stats */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">Weekly Performance</span>
                                </div>
                                <span className="text-sm font-black text-green-500">{stats.weeklyPerformance}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">Campaign Orders</span>
                                </div>
                                <span className="text-sm font-black text-blue-600">{stats.campaignOrders.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
