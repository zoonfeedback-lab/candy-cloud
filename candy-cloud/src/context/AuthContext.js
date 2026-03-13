"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState("login"); // "login" or "register"

    const openAuthModal = (mode = "login") => {
        setAuthModalMode(mode);
        setShowAuthModal(true);
    };
    const closeAuthModal = () => setShowAuthModal(false);

    // Load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("cc_token");
        const savedUser = localStorage.getItem("cc_user");
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    // Request OTP for Registration
    const requestRegistrationOTP = async (email) => {
        const res = await fetch(`/api/auth/register/otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to request OTP");
        return data;
    };

    // Register
    const register = async (name, email, password, phone, otp) => {
        const res = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password, phone, otp }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Registration failed");

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("cc_token", data.token);
        localStorage.setItem("cc_user", JSON.stringify(data.user));
        return data;
    };

    // Login
    const login = async (email, password, isAdmin = false) => {
        const res = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password, isAdmin }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Login failed");

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("cc_token", data.token);
        localStorage.setItem("cc_user", JSON.stringify(data.user));
        return data;
    };

    // Google Login
    const loginWithGoogle = async (credential) => {
        const res = await fetch(`/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ credential }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Google Authentication failed");

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("cc_token", data.token);
        localStorage.setItem("cc_user", JSON.stringify(data.user));
        return data;
    };

    // Logout
    const logout = useCallback(async () => {
        try {
            await fetch(`/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            // Ignore network errors on logout
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem("cc_token");
        localStorage.removeItem("cc_user");
        localStorage.removeItem("candyCloudCart");
    }, []);

    // Refresh token
    const refreshAccessToken = useCallback(async () => {
        try {
            const res = await fetch(`/api/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                setToken(data.token);
                localStorage.setItem("cc_token", data.token);
                return data.token;
            }
        } catch (e) {
            // Refresh failed, log out
        }
        logout();
        return null;
    }, [logout]);

    // Authenticated fetch helper
    const authFetch = useCallback(async (url, options = {}) => {
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        let res = await fetch(url, { ...options, headers, credentials: "include" });

        // If 401, try refreshing token once
        if (res.status === 401 && token) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                headers["Authorization"] = `Bearer ${newToken}`;
                res = await fetch(url, { ...options, headers, credentials: "include" });
            }
        }

        return res;
    }, [token, refreshAccessToken]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            isAuthenticated: !!user,
            requestRegistrationOTP,
            register,
            login,
            loginWithGoogle,
            logout,
            authFetch,
            showAuthModal,
            authModalMode,
            openAuthModal,
            closeAuthModal,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
