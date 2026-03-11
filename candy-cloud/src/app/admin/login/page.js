"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login, logout } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const data = await login(email, password);

            // Check if user is actually an admin
            if (data.user && data.user.role === "admin") {
                router.replace("/admin");
            } else {
                // Not an admin, log them out immediately
                await logout();
                setError("Access Denied. You do not have admin privileges.");
            }
        } catch (err) {
            setError(err.message || "Invalid credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 flex flex-col items-center">

                {/* Logo */}
                <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-6 shadow-md shadow-pink-200">
                    ☁️
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">CandyCloud</h1>
                <p className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest text-center">Admin Portal</p>

                {error && (
                    <div className="w-full bg-red-50 text-red-500 text-sm font-bold p-4 rounded-xl mb-6 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="manager@candycloud.com"
                            className="w-full px-5 py-4 rounded-2xl bg-[#f8f9fa] border border-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-gray-900"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-2xl bg-[#f8f9fa] border border-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-gray-900 tracking-widest"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-2xl text-white font-bold tracking-wide text-sm text-center shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_25px_rgba(249,115,22,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 ${isLoading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-500"
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Sign In to Dashboard"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="w-full py-4 rounded-2xl text-gray-500 font-bold tracking-wide text-sm text-center hover:bg-gray-50 transition-all flex items-center justify-center border border-transparent mt-2"
                    >
                        ← Back to Store
                    </button>
                </form>

            </div>
        </div>
    );
}
