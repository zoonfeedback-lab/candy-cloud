"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { token, authFetch } = useAuth();

    // Load from local storage on mount and bind storage event listener
    useEffect(() => {
        const loadCart = () => {
            try {
                // Also clear cart if user is not logged in anymore (assuming cc_token removal means logout)
                if (!localStorage.getItem("cc_token")) {
                    setCartItems([]);
                    localStorage.removeItem("candyCloudCart");
                } else {
                    const savedCart = localStorage.getItem("candyCloudCart");
                    if (savedCart) {
                        setCartItems(JSON.parse(savedCart));
                    }
                }
            } catch (error) {
                console.error("Failed to load cart from local storage", error);
            }
        };

        loadCart();
        setIsLoaded(true);

        const handleStorageChange = (e) => {
            if (e.key === "cc_token" && !e.newValue) {
                setCartItems([]);
                localStorage.removeItem("candyCloudCart");
            }
            if (e.key === "candyCloudCart" && !e.newValue) {
                setCartItems([]);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Sync with backend when token is available
    useEffect(() => {
        const fetchRemoteCart = async () => {
            if (token) {
                try {
                    const res = await authFetch(`/api/cart`);
                    const data = await res.json();
                    if (data.success && data.cart) {
                        // Map backend format back to frontend format
                        const mappedItems = data.cart.items.map(item => ({
                            id: item.product,
                            name: item.name,
                            emoji: item.emoji,
                            price: item.price,
                            quantity: item.quantity,
                            items: item.description,
                        }));
                        setCartItems(mappedItems);
                    }
                } catch (error) {
                    console.error("Failed to fetch remote cart", error);
                }
            }
        };
        fetchRemoteCart();
    }, [token, authFetch]);

    // Save to local storage whenever cart items change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem("candyCloudCart", JSON.stringify(cartItems));
            } catch (error) {
                console.error("Failed to save cart to local storage", error);
            }
        }
    }, [cartItems, isLoaded]);

    const addToCart = async (product, quantity = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, { ...product, quantity }];
            }
        });

        if (token) {
            try {
                await authFetch(`/api/cart`, {
                    method: "POST",
                    body: JSON.stringify({
                        productId: product.id,
                        name: product.name,
                        emoji: product.emoji || "🎁",
                        price: product.price,
                        quantity,
                        description: product.items || product.description || product.type || "",
                    }),
                });
            } catch (err) {
                console.error("Failed to sync add to cart", err);
            }
        }
    };

    const removeFromCart = async (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
        if (token) {
            try {
                await authFetch(`/api/cart/${id}`, { method: "DELETE" });
            } catch (err) {
                console.error("Failed to sync remove from cart", err);
            }
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
        );
        if (token) {
            try {
                await authFetch(`/api/cart/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({ quantity: newQuantity }),
                });
            } catch (err) {
                console.error("Failed to sync update cart quantity", err);
            }
        }
    };

    const clearCart = useCallback(async () => {
        setCartItems([]);
        if (token) {
            try {
                await authFetch(`/api/cart`, { method: "DELETE" });
            } catch (err) {
                console.error("Failed to sync clear cart", err);
            }
        }
    }, [token, authFetch]);

    const clearLocalCart = useCallback(() => {
        setCartItems([]);
    }, []);


    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            clearLocalCart,
            totalItems,
            cartTotal,
            isLoaded
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
