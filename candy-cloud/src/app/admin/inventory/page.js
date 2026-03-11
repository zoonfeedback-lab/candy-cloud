"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
    { value: "sweet-treat", label: "Sweet Treat" },
    { value: "dreamy-delight", label: "Dreamy Delight" },
    { value: "cloud-nine", label: "Cloud Nine" },
    { value: "bundle", label: "Bundle" },
    { value: "special-deal", label: "Special Deal" },
];

const EMPTY_FORM = {
    name: "",
    price: "",
    category: "sweet-treat",
    emoji: "🎁",
    description: "",
    items: "",
    stock: "100",
    isFeatured: false,
};

export default function AdminInventory() {
    const { user, authFetch, API_URL } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters & Pagination state
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                search: search,
                category: categoryFilter,
                stockStatus: stockFilter
            });

            const res = await authFetch(`${API_URL}/api/admin/inventory?${queryParams}`);
            const result = await res.json();
            if (result.success) {
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch admin inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === "admin") {
            const timeoutId = setTimeout(() => {
                fetchInventory();
            }, 300);
            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, currentPage, search, categoryFilter, stockFilter]);

    // Modal handlers
    const openAddModal = () => {
        setModalMode("add");
        setForm({ ...EMPTY_FORM });
        setEditingId(null);
        setSaveError("");
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setModalMode("edit");
        setForm({
            name: item.name || "",
            price: item.price?.toString() || "",
            category: item.category?.toLowerCase().replace(/ box$/i, "").replace(/\s+/g, "-") || "sweet-treat",
            emoji: item.emoji || "🎁",
            description: item.description || "",
            items: item.items || "",
            stock: item.stock?.toString() || "0",
            isFeatured: item.isFeatured || false,
        });
        setEditingId(item.id);
        setSaveError("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm({ ...EMPTY_FORM });
        setEditingId(null);
        setSaveError("");
    };

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveError("");

        const payload = {
            name: form.name.trim(),
            price: parseFloat(form.price),
            category: form.category,
            emoji: form.emoji.trim() || "🎁",
            description: form.description.trim(),
            items: form.items.trim(),
            stock: parseInt(form.stock) || 0,
            isFeatured: form.isFeatured,
        };

        if (!payload.name || isNaN(payload.price) || !payload.category) {
            setSaveError("Name, price, and category are required.");
            setSaving(false);
            return;
        }

        try {
            const url = modalMode === "add"
                ? `${API_URL}/api/admin/inventory`
                : `${API_URL}/api/admin/inventory/${editingId}`;

            const res = await authFetch(url, {
                method: modalMode === "add" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.success) {
                closeModal();
                fetchInventory();
            } else {
                setSaveError(result.message || "Failed to save product.");
            }
        } catch (err) {
            console.error("Save error:", err);
            setSaveError("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!data && loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>)}
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl w-full"></div>
            </div>
        );
    }

    if (!data) return <div className="text-red-500 font-bold">Failed to load inventory data.</div>;

    const { kpis, inventory, pagination } = data;

    // Helper for KPI styling
    const getKpiBadge = (status) => {
        if (status === "Healthy") {
            return (
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 border-[3px] border-white shadow-sm ring-1 ring-gray-100 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            );
        }
        if (status === "Low Stock") {
            return (
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 border-[3px] border-white shadow-sm ring-1 ring-gray-100 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
            );
        }
        return (
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-300 border-[3px] border-white shadow-sm ring-1 ring-gray-100 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
        );
    };

    const getCategoryStyles = (category) => {
        if (category.includes("Sweet Treat") || category.includes("sweet-treat")) return { bg: "bg-orange-50", text: "text-orange-500", icon: "✨" };
        if (category.includes("Dreamy Delight") || category.includes("dreamy-delight")) return { bg: "bg-green-50", text: "text-green-500", icon: "📋" };
        if (category.includes("Cloud Nine") || category.includes("cloud-nine")) return { bg: "bg-blue-50", text: "text-blue-500", icon: "🖌️" };
        if (category.includes("bundle")) return { bg: "bg-purple-50", text: "text-purple-500", icon: "🎁" };
        if (category.includes("special")) return { bg: "bg-yellow-50", text: "text-yellow-600", icon: "⭐" };
        return { bg: "bg-gray-50", text: "text-gray-500", icon: "📦" };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            <div className="flex justify-between items-center text-sm font-bold">
                <h1 className="text-2xl font-black text-gray-900">Inventory Management</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Sweet Treat */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Sweet Treat <span className="font-medium">({kpis.sweetTreat.status})</span></p>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">{kpis.sweetTreat.items} Items</h2>
                            <p className="text-xs font-bold text-orange-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                                -5% from last week
                            </p>
                        </div>
                        {getKpiBadge(kpis.sweetTreat.status)}
                    </div>
                </div>

                {/* Dreamy Delight */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Dreamy Delight <span className="font-medium">({kpis.dreamyDelight.status})</span></p>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">{kpis.dreamyDelight.items} Items</h2>
                            <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                +2% from last week
                            </p>
                        </div>
                        {getKpiBadge(kpis.dreamyDelight.status)}
                    </div>
                </div>

                {/* Cloud Nine */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Cloud Nine <span className="font-medium">({kpis.cloudNine.status})</span></p>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">{kpis.cloudNine.items} Items</h2>
                            <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <span className="inline-block w-2.5 h-[2px] bg-gray-400 rounded-full"></span>
                                Stable
                            </p>
                        </div>
                        {getKpiBadge(kpis.cloudNine.status)}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 sm:p-8">

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:flex-1 max-w-3xl">
                        {/* Search */}
                        <div className="relative flex-1">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search items by name or SKU..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-[#ea580c] transition-all text-gray-700 shadow-sm"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                                className="bg-white border border-gray-200 rounded-xl py-3 px-10 pl-11 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-[#ea580c] text-gray-700 appearance-none min-w-[160px] shadow-sm"
                            >
                                <option value="all">Category</option>
                                <option value="Sweet Treat Box">Sweet Treat</option>
                                <option value="Dreamy Delight Box">Dreamy Delight</option>
                                <option value="Cloud Nine Box">Cloud Nine</option>
                            </select>
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>

                        {/* Stock Status Filter */}
                        <div className="relative">
                            <select
                                value={stockFilter}
                                onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
                                className="bg-white border border-gray-200 rounded-xl py-3 px-10 pl-11 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-[#ea580c] text-gray-700 appearance-none min-w-[160px] shadow-sm"
                            >
                                <option value="all">Stock Status</option>
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="w-full lg:w-auto bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl py-3 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add New Item
                    </button>

                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="pb-4 pt-2 pl-4">Item Name</th>
                                <th className="pb-4 pt-2">Category</th>
                                <th className="pb-4 pt-2">SKU</th>
                                <th className="pb-4 pt-2">Price</th>
                                <th className="pb-4 pt-2">Stock Level</th>
                                <th className="pb-4 pt-2 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/80 relative">
                            {loading && (
                                <tr>
                                    <td colSpan="6">
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && inventory.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center text-gray-400 font-medium">
                                        No items found matching your filters.
                                    </td>
                                </tr>
                            )}

                            {inventory.map((item) => {
                                const styles = getCategoryStyles(item.category);
                                const maxStock = 100;
                                const stockPercent = Math.min((item.stock / maxStock) * 100, 100);

                                let barColor = "bg-green-500";
                                let textStatus = "IN STOCK";
                                let textStatusColor = "text-green-500";

                                if (item.stockStatus === "out_of_stock") {
                                    barColor = "bg-red-400";
                                    textStatus = "OUT OF STOCK";
                                    textStatusColor = "text-red-400";
                                } else if (item.stockStatus === "low_stock") {
                                    barColor = "bg-orange-500";
                                    textStatus = "LOW STOCK";
                                    textStatusColor = "text-orange-500";
                                }

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">

                                        <td className="py-5 pl-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg shadow-sm">
                                                {item.emoji || styles.icon}
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                                                {item.isFeatured && (
                                                    <span className="ml-2 text-[9px] font-black text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full border border-yellow-200">⭐ FEATURED</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${styles.bg} ${styles.text}`}>
                                                {item.category.replace(/ Box$/i, "")}
                                            </span>
                                        </td>

                                        <td className="py-5">
                                            <span className="font-mono text-xs font-bold text-gray-500 tracking-wider">
                                                {item.sku}
                                            </span>
                                        </td>

                                        <td className="py-5 font-black text-gray-900 text-sm">
                                            Rs {item.price.toLocaleString()}
                                        </td>

                                        <td className="py-5">
                                            <div className="flex flex-col gap-1 w-32">
                                                <div className="flex justify-between items-center text-[10px] font-black">
                                                    <span className={`${textStatusColor}`}>{textStatus}</span>
                                                    <span className="text-gray-900">{item.stock}/100</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${stockPercent}%` }}></div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-5 text-right pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    title="Edit item"
                                                    className="text-gray-400 hover:text-[#ea580c] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                                                </button>
                                                {item.stockStatus === "out_of_stock" ? (
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="ml-2 text-[#ea580c] hover:text-[#c2410c] text-xs font-bold leading-tight px-2 hover:bg-orange-50 rounded-lg py-1 transition-colors"
                                                    >
                                                        Restock<br />Now
                                                    </button>
                                                ) : (
                                                    <button className="text-gray-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors ml-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-100 gap-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">
                            {inventory.length > 0 ? ((pagination.currentPage - 1) * 10) + 1 : 0}
                            -{Math.min(pagination.currentPage * 10, pagination.totalItems)}
                        </span> of <span className="font-bold text-gray-900">{pagination.totalItems}</span> items
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={pagination?.currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>

                        <button
                            disabled={pagination?.currentPage >= pagination?.totalPages || !pagination?.totalPages}
                            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>

            </div>

            {/* ──── Add / Edit Modal ──── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeModal}></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-[32px] w-full max-w-[520px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 relative shrink-0">
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>

                            <div className="flex items-center gap-3 text-white mb-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    {modalMode === "add" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                                    )}
                                </div>
                                <h2 className="text-2xl font-black">{modalMode === "add" ? "Add New Item" : "Edit Item"}</h2>
                            </div>
                            <p className="text-white/80 text-sm font-medium">
                                {modalMode === "add" ? "Fill in the details to add a new product to your inventory." : `Editing: ${form.name}`}
                            </p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto flex-1">

                            {/* Name + Emoji Row */}
                            <div className="grid grid-cols-[1fr_80px] gap-3">
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Product Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => handleFormChange("name", e.target.value)}
                                        placeholder="e.g. Kawaii Sticker Pack"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Emoji</label>
                                    <input
                                        type="text"
                                        value={form.emoji}
                                        onChange={(e) => handleFormChange("emoji", e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            {/* Price + Stock Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Price (Rs) *</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => handleFormChange("price", e.target.value)}
                                        placeholder="0"
                                        required
                                        min="0"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Stock</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => handleFormChange("stock", e.target.value)}
                                        placeholder="100"
                                        min="0"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Category *</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => handleFormChange("category", e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-gray-700 appearance-none"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => handleFormChange("description", e.target.value)}
                                    placeholder="Short product description..."
                                    rows={2}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-gray-700 resize-none placeholder:text-gray-300"
                                />
                            </div>

                            {/* Bundle Items (only shown for bundle/special-deal) */}
                            {(form.category === "bundle" || form.category === "special-deal") && (
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Bundle Items (comma-separated)</label>
                                    <textarea
                                        value={form.items}
                                        onChange={(e) => handleFormChange("items", e.target.value)}
                                        placeholder="e.g. Stickers, Washi Tape, Erasers"
                                        rows={2}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-gray-700 resize-none placeholder:text-gray-300"
                                    />
                                </div>
                            )}

                            {/* Featured Toggle */}
                            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Featured Product</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Show this product in featured sections</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleFormChange("isFeatured", !form.isFeatured)}
                                    className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${form.isFeatured ? "bg-[#ea580c]" : "bg-gray-300"}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.isFeatured ? "translate-x-6" : "translate-x-1"}`}></div>
                                </button>
                            </div>

                            {/* Error */}
                            {saveError && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                                    <p className="text-sm font-bold text-red-600">{saveError}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                        saving
                                            ? "bg-orange-300 text-white cursor-not-allowed"
                                            : "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm shadow-orange-200"
                                    }`}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            {modalMode === "add" ? "Add Product" : "Save Changes"}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>

                        {/* Bottom decorative bar */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-orange-300 via-pink-300 to-yellow-200 shrink-0"></div>

                    </div>
                </div>
            )}

        </div>
    );
}
