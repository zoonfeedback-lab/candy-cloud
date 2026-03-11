"use client";

import { useState } from "react";

const TABS = [
    { id: "general", label: "General" },
    { id: "branding", label: "Branding" },
    { id: "shipping", label: "Shipping & Delivery" },
    { id: "payments", label: "Payments" },
    { id: "team", label: "Team" },
];

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("general");
    const [saved, setSaved] = useState(false);

    // General Settings state
    const [storeName, setStoreName] = useState("CandyCloud");
    const [supportEmail, setSupportEmail] = useState("hello@candycloud.co");
    const [businessAddress, setBusinessAddress] = useState("123 Marshmallow Lane, Sugar Valley, Karachi");

    // Branding state
    const [primaryColor, setPrimaryColor] = useState("#f0426e");
    const [secondaryColor, setSecondaryColor] = useState("#ec5b13");

    // Shipping state
    const [nationwideDelivery, setNationwideDelivery] = useState(true);
    const [expressRate, setExpressRate] = useState("250");

    // Payments state
    const [codEnabled, setCodEnabled] = useState(true);
    const [jazzCashEnabled, setJazzCashEnabled] = useState(true);
    const [easypaisaEnabled, setEasypaisaEnabled] = useState(false);

    // Team state (mock data)
    const [teamMembers] = useState([
        { name: "Alex Miller", email: "alex@candycloud.co", role: "Senior Manager", status: "Active" },
        { name: "Sarah Jenkins", email: "sarah@candycloud.co", role: "Content Editor", status: "Active" },
    ]);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
    const getInitialsBg = (name) => {
        const colors = ["bg-pink-100 text-pink-600", "bg-pink-100 text-pink-600", "bg-teal-100 text-teal-600", "bg-blue-100 text-blue-600", "bg-purple-100 text-purple-600"];
        const i = (name || "").charCodeAt(0) % colors.length;
        return colors[i];
    };

    // Toggle component
    const Toggle = ({ enabled, onChange }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${enabled ? "bg-[#ec4899]" : "bg-gray-300"}`}
        >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`}></div>
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage your magical candy store configurations</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                        saved
                            ? "bg-green-500 text-white shadow-green-200"
                            : "bg-[#ec4899] text-white hover:bg-[#be185d] shadow-pink-200 hover:shadow-pink-300"
                    }`}
                >
                    {saved ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            Saved!
                        </>
                    ) : (
                        <>
                            <span>✨</span> Save Magical Changes
                        </>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-3 text-sm font-bold transition-all relative ${
                            activeTab === tab.id
                                ? "text-[#ec4899]"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ec4899] rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* ─── General Tab ─── */}
            {activeTab === "general" && (
                <div className="space-y-10">
                    {/* General Settings */}
                    <div>
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-5">
                            <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">🏪</span>
                            General Settings
                        </h2>
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Store Name</label>
                                    <input
                                        type="text"
                                        value={storeName}
                                        onChange={e => setStoreName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Support Email</label>
                                    <input
                                        type="email"
                                        value={supportEmail}
                                        onChange={e => setSupportEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Business Address</label>
                                <textarea
                                    value={businessAddress}
                                    onChange={e => setBusinessAddress(e.target.value)}
                                    rows={2}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] transition-all resize-y"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Branding Tab ─── */}
            {activeTab === "branding" && (
                <div className="space-y-10">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-5">
                            <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">💖</span>
                            Branding
                        </h2>
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Store Logo */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-3">Store Logo</label>
                                    <div className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">Upload SVG/PNG</p>
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-3">Primary Brand Color</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full shadow-sm border border-gray-100" style={{ backgroundColor: primaryColor }}></div>
                                        <input
                                            type="text"
                                            value={primaryColor}
                                            onChange={e => setPrimaryColor(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-3">Secondary Color</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full shadow-sm border border-gray-100" style={{ backgroundColor: secondaryColor }}></div>
                                        <input
                                            type="text"
                                            value={secondaryColor}
                                            onChange={e => setSecondaryColor(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Shipping & Delivery Tab ─── */}
            {activeTab === "shipping" && (
                <div className="space-y-10">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-5">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">📦</span>
                            Shipping & Delivery
                        </h2>
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 space-y-6">
                            {/* Nationwide Delivery Toggle */}
                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Nationwide Delivery</p>
                                        <p className="text-xs text-gray-400 font-medium">Enable delivery across all regions</p>
                                    </div>
                                </div>
                                <Toggle enabled={nationwideDelivery} onChange={setNationwideDelivery} />
                            </div>

                            {/* Express Flat Rate */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Cloud Express Flat Rate</label>
                                <div className="relative w-64">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rs.</span>
                                    <input
                                        type="number"
                                        value={expressRate}
                                        onChange={e => setExpressRate(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Payments Tab ─── */}
            {activeTab === "payments" && (
                <div className="space-y-10">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-5">
                            <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">💳</span>
                            Payment Methods
                        </h2>
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* COD */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">🏠</span>
                                        <span className="text-sm font-bold text-gray-700">Cash on Delivery</span>
                                    </div>
                                    <Toggle enabled={codEnabled} onChange={setCodEnabled} />
                                </div>
                                {/* JazzCash */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded">JAZZ</span>
                                        <span className="text-sm font-bold text-gray-700">JazzCash</span>
                                    </div>
                                    <Toggle enabled={jazzCashEnabled} onChange={setJazzCashEnabled} />
                                </div>
                                {/* Easypaisa */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">💚</span>
                                        <span className="text-sm font-bold text-gray-700">Easypaisa</span>
                                    </div>
                                    <Toggle enabled={easypaisaEnabled} onChange={setEasypaisaEnabled} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Team Tab ─── */}
            {activeTab === "team" && (
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">👥</span>
                                Team Management
                            </h2>
                            <button className="flex items-center gap-2 text-sm font-bold text-[#ec4899] hover:text-[#be185d] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                Invite Member
                            </button>
                        </div>
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                        <th className="pb-4 pt-5 pl-8">Admin Member</th>
                                        <th className="pb-4 pt-5">Role</th>
                                        <th className="pb-4 pt-5">Status</th>
                                        <th className="pb-4 pt-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50/80">
                                    {teamMembers.map((member, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${getInitialsBg(member.name)}`}>
                                                        {getInitials(member.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5">
                                                <span className="text-xs font-bold text-[#ec4899] bg-pink-50 px-3 py-1 rounded-full">{member.role}</span>
                                            </td>
                                            <td className="py-5">
                                                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="py-5 pr-8 text-right">
                                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
