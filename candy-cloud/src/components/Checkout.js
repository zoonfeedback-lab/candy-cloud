"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentModal from "./StripePaymentModal";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "pk_test_placeholder");

const PAYMENT_METHODS = [
    { id: "cod", label: "Cash on Delivery", emoji: "💵", desc: "Pay when your package arrives" },
];

function CheckoutContent() {
    const { cartItems, cartTotal, isLoaded, clearCart } = useCart();
    const { isAuthenticated, authFetch, openAuthModal } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [shippingMethod, setShippingMethod] = useState("express");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [settings, setSettings] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [jazzCashData, setJazzCashData] = useState(null);
    const [easyPaisaData, setEasyPaisaData] = useState(null);
    const [paymentOrderId, setPaymentOrderId] = useState(null);

    // Shipping Form State
    const [shippingForm, setShippingForm] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
    });

    // Active reward state (auto-applied from spinner)
    const [activeReward, setActiveReward] = useState(null);
    const [rewardLoading, setRewardLoading] = useState(false);

    const isDirect = searchParams.get("direct") === "true";

    // Auto-fetch active reward and settings on mount
    useEffect(() => {
        const fetchData = async () => {
            // Fetch Settings
            try {
                const sRes = await fetch(`/api/settings`);
                const sData = await sRes.json();
                if (sData.success) {
                    setSettings(sData.data);
                    // Set default payment method based on enabled ones
                    const available = PAYMENT_METHODS.filter(m => {
                        if (m.id === 'cod') return sData.data.codEnabled !== false && sData.data.codEnabled !== 'false';
                        if (m.id === 'stripe') return sData.data.stripeEnabled !== false && sData.data.stripeEnabled !== 'false';
                        if (m.id === 'jazzcash') return sData.data.jazzCashEnabled !== false && sData.data.jazzCashEnabled !== 'false';
                        if (m.id === 'easypaisa') return sData.data.easypaisaEnabled !== false && sData.data.easypaisaEnabled !== 'false';
                        return true;
                    });
                    if (available.length > 0) setPaymentMethod(available[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }

            if (!isAuthenticated) return;
            setRewardLoading(true);
            try {
                const res = await authFetch(`/api/rewards/active`);
                const data = await res.json();
                if (data.success && data.reward) {
                    setActiveReward(data.reward);
                }
            } catch (err) {
                console.error("Failed to fetch active reward", err);
            } finally {
                setRewardLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, authFetch]);

    const isMethodEnabled = (methodId) => {
        if (!settings) return methodId === 'cod'; // Default allow COD if settings loading
        if (methodId === 'cod') return settings.codEnabled !== false && settings.codEnabled !== 'false';
        if (methodId === 'stripe') return settings.stripeEnabled !== false && settings.stripeEnabled !== 'false';
        if (methodId === 'jazzcash') return settings.jazzCashEnabled !== false && settings.jazzCashEnabled !== 'false';
        if (methodId === 'easypaisa') return settings.easypaisaEnabled !== false && settings.easypaisaEnabled !== 'false';
        return true;
    };

    if (!isLoaded) return null;

    let itemsToRender = cartItems;
    let itemsSubtotal = cartTotal;

    if (isDirect) {
        const qtyStr = searchParams.get("qty");
        const priceStr = searchParams.get("price");
        const parsedQty = qtyStr ? parseInt(qtyStr, 10) : 1;
        const parsedPrice = priceStr ? parseInt(priceStr, 10) : 0;

        const directItem = {
            id: searchParams.get("id") || "direct-bundle",
            name: searchParams.get("name") || "Custom Bundle",
            price: parsedPrice,
            emoji: searchParams.get("emoji") || "✨",
            quantity: parsedQty,
            description: "Instant Purchase"
        };
        itemsToRender = [directItem];
        itemsSubtotal = directItem.price * directItem.quantity;
    }

    if (itemsToRender.length === 0) {
        return (
            <section className="py-24 px-5 max-w-[800px] mx-auto w-full flex flex-col items-center text-center min-h-[50vh] justify-center">
                <div className="text-6xl mb-6 opacity-80">🛒</div>
                <h1 className="text-3xl font-black text-gray-800 mb-4">Your cart is empty!</h1>
                <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any sweet treats or mystery boxes yet.</p>
                <a href="/shop" className="px-8 py-3 rounded-full bg-pink-500 text-white font-bold shadow-lg hover:bg-pink-600 transition-colors">
                    Start Shopping
                </a>
            </section>
        );
    }

    const shippingCost = shippingMethod === "express" ? 500 : 0;

    // Calculate Reward Discount
    let discountAmount = 0;
    if (activeReward) {
        if (activeReward.discountType === "percentage") {
            discountAmount = itemsSubtotal * (activeReward.discountValue / 100);
        } else if (activeReward.discountType === "fixed") {
            discountAmount = Math.min(itemsSubtotal + shippingCost, activeReward.discountValue);
        } else if (activeReward.discountType === "item") {
            discountAmount = 0;
        }
    }

    const total = Math.max(0, itemsSubtotal + shippingCost - discountAmount);

    return (
        <section className="py-12 px-5 max-w-[1100px] mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-[#1a1f36] tracking-tight mb-2">
                    Where should we send the magic?
                </h1>
                <p className="text-[#8792a2] text-sm md:text-base font-medium">
                    Almost there, sugar scout! Just a few more licks and your loot is on its way.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Column: Forms */}
                <div className="flex-1 w-full flex flex-col gap-6">

                    {/* Shipping Information */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100">
                        <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-pink-500">🚚</span> Shipping Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500">First Name <span className="text-pink-500">*</span></label>
                                <input type="text" placeholder="Sugar" value={shippingForm.firstName} onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-gray-700" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500">Last Name <span className="text-pink-500">*</span></label>
                                <input type="text" placeholder="Rush" value={shippingForm.lastName} onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-gray-700" />
                            </div>
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-gray-500">Address <span className="text-pink-500">*</span></label>
                                <input type="text" placeholder="123 Gumdrop Lane" value={shippingForm.address} onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-gray-700" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500">City <span className="text-pink-500">*</span></label>
                                <input type="text" placeholder="Marshmallow City" value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-gray-700" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500">Zip Code <span className="text-pink-500">*</span></label>
                                <input type="text" placeholder="55555" value={shippingForm.zipCode} onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100">
                        <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-pink-500">🚀</span> Shipping Method
                        </h2>

                        <div className="flex flex-col gap-4">
                            {/* Express Method */}
                            <label
                                onClick={() => setShippingMethod("express")}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === "express" ? "border-pink-500 bg-pink-50/20" : "border-transparent border-gray-100 hover:border-gray-200 bg-white"}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${shippingMethod === "express" ? "border-4 border-pink-500 bg-white shadow-sm" : "border border-gray-300 bg-white"}`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">Cloud Express</span>
                                        <span className="text-xs text-gray-500">Delivered by a friendly stork in 1-2 days</span>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${shippingMethod === "express" ? "text-pink-500" : "text-gray-800"}`}>Rs 500</span>
                            </label>

                            {/* Standard Method */}
                            <label
                                onClick={() => setShippingMethod("standard")}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === "standard" ? "border-pink-500 bg-pink-50/20" : "border-transparent border-gray-100 hover:border-gray-200 bg-white"}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${shippingMethod === "standard" ? "border-4 border-pink-500 bg-white shadow-sm" : "border border-gray-300 bg-white"}`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">Sugar Snail Mail</span>
                                        <span className="text-xs text-gray-500">A slower journey for extra anticipation (5-7 days)</span>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${shippingMethod === "standard" ? "text-pink-500" : "text-gray-800"}`}>Free</span>
                            </label>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 mb-8 sm:mb-0">
                        <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-pink-500">💸</span> Payment Information
                        </h2>

                        {!isMethodEnabled('cod') ? (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 flex flex-col items-center text-center opacity-70">
                                <div className="w-14 h-14 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <path d="M2 10h20" />
                                        <path d="m15 13-6 6" /><path d="m9 13 6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-black text-gray-400 mb-2">Cash on Delivery Disabled</h3>
                                <p className="text-xs text-gray-400 max-w-sm mb-5 leading-relaxed">
                                    COD is temporarily unavailable. Please select another sweet payment method from the right!
                                </p>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-pink-200 rounded-xl p-8 bg-pink-50/30 flex flex-col items-center text-center relative overflow-hidden">
                                <div className="w-14 h-14 bg-pink-500 text-white rounded-full flex items-center justify-center mb-4 shadow-md shadow-pink-500/30 transform transition-transform hover:scale-110">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <path d="M2 10h20" />
                                        <path d="M6 14h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-black text-gray-800 mb-2">Cash on Delivery (COD)</h3>
                                <p className="text-xs text-gray-500 max-w-sm mb-5 leading-relaxed">
                                    No credit card? No problem! Hand over the gold coins when your sweets arrive at your door.
                                </p>
                                <span className="px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                    Our Signature Payment Method
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Loot Summary */}
                <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100">
                        <h2 className="text-xl font-black text-gray-800 tracking-tight mb-6">Your Loot Summary</h2>

                        {/* Items */}
                        <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {itemsToRender.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    {/* Mini Image */}
                                    <div className={`w-12 h-12 rounded-lg ${item.imageBg || "bg-pink-100"} flex items-center justify-center text-xl shrink-0 border border-gray-50`}>
                                        {item.emoji || "🎁"}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-xs font-bold text-gray-800">{item.name}</span>
                                        <span className="text-[10px] text-gray-400 font-medium line-clamp-1">{item.description || item.type}</span>
                                        {item.items && (
                                            <span className="text-[9px] text-gray-500 font-medium leading-tight mt-0.5 line-clamp-2">
                                                <span className="font-bold text-pink-500">Includes:</span> {item.items}
                                            </span>
                                        )}
                                        <span className="text-[10px] font-bold text-gray-500 mt-0.5">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="text-sm font-black text-gray-800">Rs {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="pt-5 border-t border-gray-100 space-y-3 mb-5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-gray-400">Subtotal</span>
                                <span className="font-bold text-gray-500">Rs {itemsSubtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-gray-400">Shipping</span>
                                <span className="font-bold text-gray-500">{shippingCost > 0 ? `Rs ${shippingCost.toLocaleString()}` : "Free"}</span>
                            </div>
                            {activeReward && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold text-pink-500">✨ Spinner Reward ({activeReward.label})</span>
                                    <span className="font-bold text-pink-500">
                                        -{discountAmount > 0 ? `Rs ${discountAmount.toLocaleString()}` : 'Free Gift'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                            <span className="text-xl font-black text-gray-800">Total</span>
                            <span className="text-2xl font-black text-pink-500">Rs {total.toLocaleString()}</span>
                        </div>

                        {/* Active Reward Banner */}
                        {activeReward && (
                            <div className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">✨</span>
                                    <span className="text-xs font-black text-pink-600 uppercase tracking-wider">Spinner Reward Applied!</span>
                                </div>
                                <p className="text-sm font-bold text-gray-700">{activeReward.label}</p>
                                <p className="text-[10px] text-gray-500 mt-1">This reward was auto-applied from your welcome spin.</p>
                            </div>
                        )}
                        {rewardLoading && (
                            <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                                <p className="text-xs text-gray-400 font-bold">Checking for rewards...</p>
                            </div>
                        )}

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <h3 className="text-sm font-black text-gray-800 mb-3">💳 Payment Method</h3>
                            <div className="flex flex-col gap-2">
                                {PAYMENT_METHODS.map((method) => {
                                    const isEnabled = isMethodEnabled(method.id);
                                    return (
                                        <label
                                            key={method.id}
                                            onClick={() => isEnabled && setPaymentMethod(method.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${!isEnabled
                                                ? "opacity-50 grayscale bg-gray-50 border-gray-100 cursor-not-allowed"
                                                : paymentMethod === method.id
                                                    ? "border-pink-500 bg-pink-50/30 cursor-pointer"
                                                    : "border-gray-100 hover:border-gray-200 bg-white cursor-pointer"
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full shrink-0 ${!isEnabled
                                                ? "border-gray-300 bg-gray-200"
                                                : paymentMethod === method.id
                                                    ? "border-4 border-pink-500 bg-white"
                                                    : "border border-gray-300 bg-white"
                                                }`} />
                                            <span className="text-lg">{method.emoji}</span>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs font-bold ${isEnabled ? "text-gray-800" : "text-gray-400"}`}>{method.label}</span>
                                                    {!isEnabled && (
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Disabled</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-400">{method.desc}</span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {orderError && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
                                {orderError}
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={async () => {
                                    // Validate Shipping
                                    if (!shippingForm.firstName.trim() || !shippingForm.lastName.trim() || !shippingForm.address.trim() || !shippingForm.city.trim() || !shippingForm.zipCode.trim()) {
                                        setOrderError("Please fill out all required shipping fields so the storks know where to go!");
                                        return;
                                    }

                                    // Validate Payment Method Enablement
                                    if (paymentMethod && !isMethodEnabled(paymentMethod)) {
                                        setOrderError("This payment method is temporarily unavailable. Please choose another one.");
                                        return;
                                    }

                                    setOrderError("");
                                    setOrderLoading(true);

                                    // Build order payload
                                    const orderPayload = {
                                        items: itemsToRender.map(item => ({
                                            product: item.id,
                                            name: item.name,
                                            emoji: item.emoji || "🎁",
                                            price: item.price,
                                            quantity: item.quantity,
                                            description: item.items || item.description || item.type,
                                        })),
                                        subtotal: itemsSubtotal,
                                        shippingCost,
                                        total,
                                        discountAmt: discountAmount,
                                        couponCode: activeReward ? activeReward.label : null,
                                        shippingMethod,
                                        paymentMethod,
                                        shippingAddress: shippingForm,
                                    };

                                    if (isAuthenticated) {
                                        try {
                                            const res = await authFetch(`/api/orders`, {
                                                method: "POST",
                                                body: JSON.stringify(orderPayload),
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                                if (paymentMethod === "stripe") {
                                                    const stripeRes = await authFetch(`/api/payments/stripe/create-intent`, {
                                                        method: "POST",
                                                        body: JSON.stringify({ amount: total, orderId: data.order._id }),
                                                    });
                                                    const stripeData = await stripeRes.json();

                                                    if (stripeData.success) {
                                                        setClientSecret(stripeData.clientSecret);
                                                        setIsPaymentModalOpen(true);
                                                        setPaymentOrderId(data.order.orderNumber);
                                                        setOrderLoading(false);
                                                        return;
                                                    } else {
                                                        setOrderError("Failed to initialize secure payment.");
                                                    }
                                                } else if (paymentMethod === "jazzcash") {
                                                    const jcRes = await authFetch(`/api/payments/jazzcash/initiate`, {
                                                        method: "POST",
                                                        body: JSON.stringify({ amount: total, orderId: data.order._id }),
                                                    });
                                                    const jcData = await jcRes.json();

                                                    if (jcData.success) {
                                                        setJazzCashData({
                                                            url: jcData.paymentUrl,
                                                            data: jcData.paymentData
                                                        });
                                                        return;
                                                    } else {
                                                        setOrderError(jcData.message || "Failed to initialize JazzCash payment.");
                                                    }
                                                } else if (paymentMethod === "easypaisa") {
                                                    const epRes = await authFetch(`/api/payments/easypaisa/initiate`, {
                                                        method: "POST",
                                                        body: JSON.stringify({ amount: total, orderId: data.order._id }),
                                                    });
                                                    const epData = await epRes.json();

                                                    if (epData.success) {
                                                        setEasyPaisaData({
                                                            url: epData.paymentUrl,
                                                            data: epData.paymentData
                                                        });
                                                        return;
                                                    } else {
                                                        setOrderError(epData.message || "Failed to initialize EasyPaisa payment.");
                                                    }
                                                } else {
                                                    // Redeem reward if applied
                                                    if (activeReward) {
                                                        try {
                                                            await authFetch(`/api/rewards/redeem`, { method: "POST" });
                                                        } catch (e) { console.error("Failed to redeem reward", e); }
                                                    }
                                                    if (!isDirect) clearCart();
                                                    router.push(`/success?orderId=${data.order.orderNumber}`);
                                                }
                                            } else {
                                                setOrderError(data.message || "Order failed");
                                            }
                                        } catch (err) {
                                            setOrderError("Network error. Please try again.");
                                        }
                                    } else {
                                        if (!isDirect) clearCart();
                                        const guestOrderId = "GST-" + Math.floor(10000 + Math.random() * 90000);
                                        router.push(`/success?orderId=${guestOrderId}`);
                                    }

                                    setOrderLoading(false);
                                }}
                                disabled={orderLoading}
                                className={`w-full py-4 rounded-xl text-white font-black tracking-wide text-lg text-center shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_25px_rgba(236,72,153,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${orderLoading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-500"
                                    }`}
                            >
                                {orderLoading ? "Placing Order..." : "Confirm My Loot!"} <span className="text-xl">🎉</span>
                            </button>

                            {!isAuthenticated && (
                                <p className="text-xs text-center text-gray-400">
                                    <button onClick={() => openAuthModal('login')} className="text-pink-500 font-bold hover:underline">Sign in</button> to save your order history!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Disclaimer outside the card */}
                    <p className="text-[10px] text-gray-400 text-center mt-6 max-w-[300px] mx-auto leading-relaxed px-4">
                        By clicking 'Confirm My Loot!', you agree to have your taste buds blown away. No returns on melted dreams.
                    </p>
                </div>

            </div>

            {clientSecret && isPaymentModalOpen && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <StripePaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        totalAmount={total}
                        onPaymentSuccess={() => {
                            if (!isDirect) clearCart();
                            router.push(`/success?orderId=${paymentOrderId}`);
                        }}
                    />
                </Elements>
            )}

            {/* Hidden JazzCash Auto-Submit Form */}
            {jazzCashData && (
                <form
                    id="jazzcash-form"
                    method="POST"
                    action={jazzCashData.url}
                    ref={(el) => { if (el) el.submit(); }}
                >
                    {Object.entries(jazzCashData.data).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value} />
                    ))}
                </form>
            )}

            {/* Hidden EasyPaisa Auto-Submit Form */}
            {easyPaisaData && (
                <form
                    id="easypaisa-form"
                    method="POST"
                    action={easyPaisaData.url}
                    ref={(el) => { if (el) el.submit(); }}
                >
                    {Object.entries(easyPaisaData.data).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value} />
                    ))}
                </form>
            )}
        </section>
    );
}

export default function Checkout() {
    return (
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-pink-500 font-bold">Summoning your checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
