"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { token, authFetch } = useAuth();

    // Load from local storage on mount and bind storage event listener
    useEffect(() => {
        const loadWishlist = () => {
            try {
                if (!localStorage.getItem("cc_token")) {
                    setWishlistItems([]);
                    localStorage.removeItem("candyCloudWishlist");
                } else {
                    const savedWishlist = localStorage.getItem("candyCloudWishlist");
                    if (savedWishlist) {
                        setWishlistItems(JSON.parse(savedWishlist));
                    }
                }
            } catch (error) {
                console.error("Failed to load wishlist from local storage", error);
            }
        };

        loadWishlist();
        setIsLoaded(true);

        const handleStorageChange = (e) => {
            if (e.key === "cc_token" && !e.newValue) {
                setWishlistItems([]);
                localStorage.removeItem("candyCloudWishlist");
            }
            if (e.key === "candyCloudWishlist" && !e.newValue) {
                setWishlistItems([]);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Sync with backend when token is available
    useEffect(() => {
        const fetchRemoteWishlist = async () => {
            if (token) {
                try {
                    const res = await authFetch(`/api/wishlist`);
                    const data = await res.json();
                    if (data.success && data.wishlist) {
                        const mappedItems = data.wishlist.items.map(item => ({
                            productId: item.productId,
                            name: item.name,
                            emoji: item.emoji || "🎁",
                            type: item.type || "product",
                            description: item.description || "",
                        }));
                        setWishlistItems(mappedItems);
                    }
                } catch (error) {
                    console.error("Failed to fetch remote wishlist", error);
                }
            }
        };
        fetchRemoteWishlist();
    }, [token, authFetch]);

    // Save to local storage whenever wishlist items change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem("candyCloudWishlist", JSON.stringify(wishlistItems));
            } catch (error) {
                console.error("Failed to save wishlist to local storage", error);
            }
        }
    }, [wishlistItems, isLoaded]);

    const addToWishlist = async (product) => {
        if (wishlistItems.find(item => item.productId === product.productId)) return;

        setWishlistItems(prev => [...prev, product]);

        if (token) {
            try {
                await authFetch(`/api/wishlist`, {
                    method: "POST",
                    body: JSON.stringify({
                        productId: product.productId,
                        name: product.name,
                        emoji: product.emoji || "🎁",
                        type: product.type || "product",
                        description: product.description || "",
                    }),
                });
            } catch (err) {
                console.error("Failed to sync add to wishlist", err);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        if (token) {
            try {
                await authFetch(`/api/wishlist/${productId}`, { method: "DELETE" });
            } catch (err) {
                console.error("Failed to sync remove from wishlist", err);
            }
        }
    };

    const toggleWishlist = async (product) => {
        if (wishlistItems.find(item => item.productId === product.productId)) {
            await removeFromWishlist(product.productId);
        } else {
            await addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return !!wishlistItems.find(item => item.productId === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            isLoaded,
            totalItems: wishlistItems.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
