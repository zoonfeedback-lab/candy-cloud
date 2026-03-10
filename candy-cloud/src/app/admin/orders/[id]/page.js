"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params?.id || "1093";

    // In a real app we'd fetch this from the backend. 
    // Using mock data based on the provided UI design.
    const [order] = useState({
        id: `CC-${orderId}`,
        date: "Oct 12, 2023 at 11:45 AM",
        isGoldenScoop: true,
        status: "Stork Transit",
        estimatedDelivery: "Tomorrow",
        customer: {
            name: "Barry Kandy",
            email: "barry.k@sweetmail.com",
            phone: "+92 300 1234567",
            isGoldenWinner: true,
            initials: "BK"
        },
        shipping: {
            addressName: "Cloud Castle #7",
            line1: "Sweet Tooth Lane, Phase 5",
            line2: "DHA, Lahore 54000",
            country: "Pakistan"
        },
        payment: {
            method: "Cash on Delivery",
            amount: 120.00,
            status: "PAID"
        },
        items: [
            {
                id: 1,
                name: "Stellar Cloud Stickers",
                sku: "STICK-001",
                quantity: 2,
                unitPrice: 20.00,
                total: 40.00,
                iconClass: "bg-blue-50 text-blue-500",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
            },
            {
                id: 2,
                name: "Rainbow Washi Tape",
                sku: "TAPE-982",
                quantity: 1,
                unitPrice: 30.00,
                total: 30.00,
                iconClass: "bg-purple-50 text-purple-500",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
            },
            {
                id: 3,
                name: "Mystery Box - Cloud Nine",
                sku: "MYST-BOX-9",
                quantity: 1,
                unitPrice: 50.00,
                total: 50.00,
                iconClass: "bg-orange-50 text-orange-500",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8" /><path d="M1 3h22v5H1z" /><path d="M10 12h4" /></svg>
            }
        ],
        totals: {
            subtotal: 120.00,
            shipping: 0.00,
            grandTotal: 120.00
        },
        history: [
            {
                id: 1,
                title: "Stork dispatched with extra feathers",
                description: "Package is now flying towards Lahore",
                time: "Today, 10:00 AM",
            },
            {
                id: 2,
                title: "Magical sparkles applied to packaging",
                description: "Quality check by Chief Sparkle Officer",
                time: "Yesterday, 2:00 PM",
            },
            {
                id: 3,
                title: "Order scooped with love",
                description: "Items picked and verified for sweetness",
                time: "Yesterday, 11:00 AM",
            },
            {
                id: 4,
                title: "Order placed by Barry Kandy",
                description: "Customer secured a Golden Scoop!",
                time: "Oct 12, 11:45 AM",
            }
        ]
    });

    const isStepCompleted = (stepName) => {
        const statuses = ["Sweet Sorting", "Magical Packaging", "Stork Transit", "Doorstep Delight"];
        const currentIndex = statuses.indexOf(order.status);
        const stepIndex = statuses.indexOf(stepName);
        return stepIndex <= currentIndex;
    };

    const isStepCurrent = (stepName) => order.status === stepName;

    // Modal State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [statusUpdateForm, setStatusUpdateForm] = useState({
        status: order.status,
        internalMemo: "",
        customerLog: ""
    });

    const handleUpdateStatusSubmit = () => {
        // Here we would dispatch to backend
        console.log("Submitting status update:", statusUpdateForm);
        // Simulate success and close
        setIsUpdateModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            {/* Top Bar / Breadcrumbs Container mapped from screenshot */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pb-6 border-b border-gray-100">
                <div className="flex items-center text-sm font-bold">
                    <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">Dashboard</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600 transition-colors">Orders</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-900">#{order.id}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-gray-700"
                        />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </div>

            {/* Header Actions & Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-black text-gray-900">Order #{order.id}</h1>
                        {order.isGoldenScoop && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-[#d97706] text-[10px] font-black tracking-widest uppercase rounded-full border border-yellow-200">
                                ⭐ Golden Scoop Winner
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-500">Placed on {order.date}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Print Label
                    </button>
                    <button
                        onClick={() => setIsUpdateModalOpen(true)}
                        className="px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl text-sm transition-colors shadow-sm"
                    >
                        Update Status
                    </button>
                    <button className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                        Send Magic Note
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left side (2/3 width) - Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Status Stepper Card */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-gray-700 font-bold hidden sm:block">Current Status: <span className="text-[#3b82f6] ml-2">{order.status}</span></h3>
                            <h3 className="text-gray-700 font-bold sm:hidden">Status: <span className="text-[#3b82f6] ml-1">{order.status}</span></h3>
                            <span className="text-xs font-medium text-gray-400 text-right">Estimated Delivery: {order.estimatedDelivery}</span>
                        </div>

                        {/* Stepper Logic mapped to UI */}
                        <div className="relative flex justify-between">
                            {/* Line connector */}
                            <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full z-0 -translate-y-1/2"></div>

                            {/* Filled connector based on current status */}
                            <div className="absolute top-5 left-0 h-1 bg-[#3b82f6] rounded-full z-0 -translate-y-1/2 transition-all duration-700" style={{ width: '66%' }}></div>

                            {/* Steps */}
                            <div className="relative z-10 flex flex-col items-center gap-3 w-1/4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 shadow-sm ${isStepCompleted('Sweet Sorting') ? 'bg-green-500' : 'bg-gray-200'}`}>
                                    {isStepCompleted('Sweet Sorting') ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : '1'}
                                </div>
                                <span className={`text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-center ${isStepCompleted('Sweet Sorting') ? 'text-gray-900' : 'text-gray-400'}`}>Sweet Sorting</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-3 w-1/4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 shadow-sm ${isStepCompleted('Magical Packaging') ? 'bg-green-500' : 'bg-gray-200'}`}>
                                    {isStepCompleted('Magical Packaging') ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : '2'}
                                </div>
                                <span className={`text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-center ${isStepCompleted('Magical Packaging') ? 'text-gray-900' : 'text-gray-400'}`}>Magical Packaging</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-3 w-1/4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 shadow-md ${isStepCurrent('Stork Transit') ? 'bg-[#3b82f6] text-white ring-4 ring-blue-100 scale-110' : (isStepCompleted('Stork Transit') ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200')}`}>
                                    {isStepCurrent('Stork Transit') ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" /><polyline points="15,9 18,9 18,11" /><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" /></svg>
                                    ) : (isStepCompleted('Stork Transit') ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : '3')}
                                </div>
                                <span className={`text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-center ${isStepCurrent('Stork Transit') ? 'text-[#3b82f6]' : (isStepCompleted('Stork Transit') ? 'text-gray-900' : 'text-gray-400')}`}>Stork Transit</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-3 w-1/4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-100 text-gray-300`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                </div>
                                <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Doorstep Delight</span>
                            </div>
                        </div>
                    </div>

                    {/* Three Cards Layout: Info, Shipping, Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        {/* Customer Info Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-black text-sm">
                                    {order.customer.initials}
                                </div>
                                <h3 className="font-bold text-gray-900 text-[15px] leading-tight flex-1">Customer<br />Info</h3>
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <p className="font-bold text-gray-900 text-sm">{order.customer.name}</p>
                                <p className="text-xs text-gray-500 font-medium truncate" title={order.customer.email}>{order.customer.email}</p>
                                <p className="text-xs text-gray-500 font-medium">{order.customer.phone}</p>
                            </div>
                            {order.customer.isGoldenWinner && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <span className="inline-block px-2.5 py-1 bg-[#fff8e1] text-[#f59e0b] border border-[#fef3c7] text-[9px] font-black tracking-widest uppercase rounded">
                                        Golden Winner
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Shipping Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" /></svg>
                                </div>
                                <h3 className="font-bold text-gray-900 text-[15px]">Shipping</h3>
                            </div>
                            <div className="space-y-1.5 text-xs text-gray-500 font-medium flex-1 leading-relaxed">
                                <p className="font-bold text-gray-900 text-sm mb-2">{order.shipping.addressName}</p>
                                <p>{order.shipping.line1}</p>
                                <p>{order.shipping.line2}</p>
                                <p>{order.shipping.country}</p>
                            </div>
                        </div>

                        {/* Payment Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                </div>
                                <h3 className="font-bold text-gray-900 text-[15px]">Payment</h3>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Method</span>
                                    <span className="text-gray-700 font-bold text-right w-1/2 leading-tight">{order.payment.method}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Amount</span>
                                    <span className="text-gray-900 font-black">Rs {order.payment.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1">
                                    <span className="text-gray-400 font-medium">Status</span>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-600 font-black tracking-widest text-[9px] uppercase rounded">
                                        {order.payment.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Items Scooped Table */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 sm:p-8 flex justify-between items-center border-b border-gray-50 bg-white">
                            <h3 className="text-lg font-black text-gray-900">Items Scooped</h3>
                            <span className="text-xs font-bold text-orange-500">{order.items.length} Items Total</span>
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
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="py-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconClass}`}>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm mb-0.5">{item.name}</p>
                                                        <p className="text-[10px] font-black text-gray-400 tracking-wider">SKU: {item.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 text-gray-600 font-medium text-sm text-center">x {item.quantity}</td>
                                            <td className="py-5 text-gray-500 font-medium text-sm text-right">Rs {item.unitPrice.toFixed(2)}</td>
                                            <td className="py-5 pr-8 text-gray-900 font-black text-sm text-right">Rs {item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="w-full bg-white flex flex-col items-end p-6 sm:px-8 space-y-3 pb-8">
                            <div className="w-full max-w-[300px] flex justify-between items-center">
                                <span className="text-gray-500 font-bold text-sm">Subtotal</span>
                                <span className="text-gray-900 font-black text-sm">Rs {order.totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="w-full max-w-[300px] flex justify-between items-center mb-4">
                                <span className="text-gray-500 font-bold text-sm">Shipping</span>
                                <span className="text-gray-900 font-black text-sm">Rs {order.totals.shipping.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Grand Total Footer attached to the table container bottom */}
                        <div className="w-full bg-gray-50/80 border-t border-gray-100 flex justify-end items-center px-6 sm:px-8 py-5">
                            <div className="w-full max-w-[300px] flex justify-between items-center">
                                <span className="text-gray-900 font-black text-lg">Grand Total</span>
                                <span className="text-orange-500 font-black text-2xl">Rs {order.totals.grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Right sidebar (1/3 width) - Magic History */}
                <div className="lg:col-span-1">
                    <div className="bg-[#fffdfa] rounded-3xl p-6 sm:p-8 border border-[#fef3c7] shadow-sm sticky top-6">

                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Magic History</h3>
                        </div>

                        <div className="relative border-l-2 border-orange-100 ml-4 space-y-8 pb-4">
                            {order.history.map((event, i) => (
                                <div key={event.id} className="relative pl-6">
                                    {/* Timeline Dot */}
                                    {i === 0 ? (
                                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white ring-2 ring-orange-100"></div>
                                    ) : (
                                        <div className="absolute -left-[4px] top-1.5 w-1.5 h-1.5 bg-orange-300 rounded-full"></div>
                                    )}

                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 text-[13px] leading-snug mb-1">{event.title}</span>
                                        <span className="text-gray-500 text-xs font-medium mb-3 leading-snug">{event.description}</span>

                                        {/* Time Badge */}
                                        <span className={`inline-block w-max px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest ${i === 0 ? 'bg-blue-50 text-[#3b82f6]' : 'bg-gray-100 text-gray-400'}`}>
                                            {event.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
                            View Full Logs
                        </button>
                    </div>
                </div>

            </div>

            {/* Update Status Modal UI */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsUpdateModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-[32px] w-full max-w-[480px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-8 relative">
                            {/* Close button */}
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>

                            <div className="flex items-center gap-3 text-white mb-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" /><path d="M8 18h1" /><path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z" /></svg>
                                </div>
                                <h2 className="text-2xl font-black">Update Magic Status</h2>
                            </div>
                            <p className="text-white/80 text-sm font-medium">Order <strong>#{order.id}</strong> • Currently in <em>{order.status}</em></p>
                        </div>

                        {/* Body Form */}
                        <div className="p-8 space-y-6">

                            {/* Select Status */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700">New Magic Status</label>
                                <div className="relative">
                                    <select
                                        value={statusUpdateForm.status}
                                        onChange={(e) => setStatusUpdateForm({ ...statusUpdateForm, status: e.target.value })}
                                        className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-shadow pr-10"
                                    >
                                        <option value="Sweet Sorting">Sweet Sorting</option>
                                        <option value="Magical Packaging">Magical Packaging</option>
                                        <option value="Stork Transit">Stork Transit</option>
                                        <option value="Doorstep Delight">Doorstep Delight</option>
                                    </select>
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>

                            {/* Internal Memo */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                    Internal Magic Memo
                                    <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                </label>
                                <textarea
                                    value={statusUpdateForm.internalMemo}
                                    onChange={(e) => setStatusUpdateForm({ ...statusUpdateForm, internalMemo: e.target.value })}
                                    placeholder="e.g. Extra feathers added to stork..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-shadow min-h-[80px] resize-none"
                                ></textarea>
                            </div>

                            {/* Customer Log */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                    Customer Magic History Log
                                    <svg className="text-pink-500" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m10 13-2 2 2 2" /><path d="m14 17 2-2-2-2" /></svg>
                                </label>
                                <textarea
                                    value={statusUpdateForm.customerLog}
                                    onChange={(e) => setStatusUpdateForm({ ...statusUpdateForm, customerLog: e.target.value })}
                                    placeholder="Your treats are currently gliding through the sugar-clouds!"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-shadow min-h-[80px] resize-none"
                                ></textarea>
                            </div>

                        </div>

                        {/* Footer Buttons */}
                        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleUpdateStatusSubmit}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3.5 rounded-xl shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                Apply Magic Update
                            </button>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl transition-colors"
                            >
                                Nevermind
                            </button>
                        </div>

                        {/* Bottom decorative bar (matching design) */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-pink-300 via-orange-300 to-yellow-200"></div>

                    </div>
                </div>
            )}

        </div>
    );
}
