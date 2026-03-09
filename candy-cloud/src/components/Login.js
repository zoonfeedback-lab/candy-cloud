"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-[80vh] flex items-center justify-center px-5 py-16 bg-gradient-to-b from-pink-50 to-white">
            <div className="w-full max-w-[440px]">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="text-5xl mb-4">🍬</div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Welcome Back!</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to your CandyCloud account</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-pink-100/50">
                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white focus:border-pink-300 transition-all text-gray-700"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white focus:border-pink-300 transition-all text-gray-700"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl text-white font-black text-base tracking-wide shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(236,72,153,0.4)] transition-all ${loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-500"}`}
                        >
                            {loading ? "Signing in..." : "Sign In ✨"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-pink-500 font-bold hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
