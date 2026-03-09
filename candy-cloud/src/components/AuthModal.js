"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
    const {
        showAuthModal,
        authModalMode,
        closeAuthModal,
        login,
        register,
        requestRegistrationOTP,
    } = useAuth();

    const [mode, setMode] = useState(authModalMode);
    const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync mode when modal opens or explicitly changed from elsewhere
    useEffect(() => {
        if (showAuthModal) {
            setMode(authModalMode);
            setError("");
        }
    }, [showAuthModal, authModalMode]);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setName("");
        setConfirmPassword("");
        setOtp("");
        setError("");
        setStep(1);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setStep(1);
        setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            resetForm();
            closeAuthModal();
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!emailRegex.test(email)) {
            setError("Registration is limited to valid @gmail.com addresses only.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            await requestRegistrationOTP(email);
            setStep(2); // Move to OTP verification step
            setError("");
        } catch (err) {
            setError(err.message || "Could not send verification code");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");

        if (otp.length < 6) {
            setError("Please enter the 6-digit verification code");
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password, "", otp);
            resetForm();
            closeAuthModal();
        } catch (err) {
            setError(err.message || "Invalid verification code");
        } finally {
            setLoading(false);
        }
    };

    if (!showAuthModal || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={closeAuthModal}
            ></div>

            {/* Modal */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 w-full max-w-[420px] relative z-10 shadow-2xl overflow-hidden text-left max-h-[90vh] overflow-y-auto">

                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-xl opacity-60"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-50 rounded-full blur-xl opacity-60"></div>

                {/* Close button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-colors z-20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6 relative z-10">
                    <div className="w-14 h-14 bg-pink-50 border border-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-sm">
                        {mode === "login" ? "👋" : "🎉"}
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-1">
                        {mode === "login" ? "Welcome Back!" : "Join CandyCloud"}
                    </h2>
                    <p className="text-xs text-gray-500">
                        {mode === "login"
                            ? "Sign in to access your sweetness"
                            : "Create an account to start collecting treats"
                        }
                    </p>
                </div>

                {/* Tab Toggle (Only visible on Step 1) */}
                {step === 1 && (
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-6 relative z-10">
                        <button
                            onClick={() => switchMode("login")}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === "login"
                                ? "bg-white text-pink-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => switchMode("register")}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === "register"
                                ? "bg-white text-pink-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Create Account
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center relative z-10">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                {mode === "login" && (
                    <form onSubmit={handleLogin} className="flex flex-col gap-3.5 relative z-10">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="sweet@candycloud.pk"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all text-gray-700"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all text-gray-700"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 mt-1 rounded-2xl bg-gradient-to-r from-[#ff6fae] to-[#ff3c8e] text-white font-black tracking-wide text-sm shadow-[0_8px_20px_rgba(255,111,174,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,111,174,0.4)] transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Signing in..." : "Sign In ✨"}
                        </button>
                    </form>
                )}

                {/* Register Form - Step 1 (Details) */}
                {mode === "register" && step === 1 && (
                    <form onSubmit={handleRequestOTP} className="flex flex-col gap-3.5 relative z-10">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Sugar Plum"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all text-gray-700"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email (Must be @gmail.com)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="sweet@gmail.com"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all text-gray-700"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all text-gray-700"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 mt-1 rounded-2xl bg-gradient-to-r from-[#ff6fae] to-[#ff3c8e] text-white font-black tracking-wide text-sm shadow-[0_8px_20px_rgba(255,111,174,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,111,174,0.4)] transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Sending Code..." : "Next: Verify Email 📨"}
                        </button>
                    </form>
                )}

                {/* Register Form - Step 2 (OTP Verification) */}
                {mode === "register" && step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4 relative z-10 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            We've sent a 6-digit verification code to <span className="font-bold text-gray-800">{email}</span>. Please enter it below.
                        </p>

                        <div className="flex flex-col gap-2 mx-auto w-3/4">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-pink-100 text-2xl tracking-[0.5em] text-center font-black focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#ff6fae] to-[#ff3c8e] text-white font-black tracking-wide text-sm shadow-[0_8px_20px_rgba(255,111,174,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,111,174,0.4)] transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Verifying..." : "Create Account ✨"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-xs text-gray-400 hover:text-pink-500 font-bold transition-colors mt-2"
                        >
                            ← Back to edit details
                        </button>
                    </form>
                )}

                {/* Footer Toggle Text */}
                <div className="mt-6 text-center text-sm text-gray-500 relative z-10">
                    {mode === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <button type="button" onClick={() => switchMode("register")} className="text-pink-600 font-bold hover:underline transition-all">
                                Create an account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button type="button" onClick={() => switchMode("login")} className="text-pink-600 font-bold hover:underline transition-all">
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
