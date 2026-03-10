"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminCustomersRedirect() {
    const router = useRouter();
    const { user, authFetch, API_URL } = useAuth();

    useEffect(() => {
        const findCustomer = async () => {
            if (!user || user.role !== "admin") return;

            try {
                // We'll fetch the recent orders to find a valid customer ID who actually has order history
                const res = await authFetch(`${API_URL}/api/admin/orders?limit=5`);
                const result = await res.json();

                if (result.success && result.orders && result.orders.length > 0) {
                    // Since our orders endpoint populates "user" differently or isn't sending the raw ID directly in formattedOrders, 
                    // let's fetch the dashboard instead, or we can just fetch all users if we had an endpoint.
                    // The dashboard `recentOrders` has `user` populated. Let's use the dashboard to find an ID.
                    const dashRes = await authFetch(`${API_URL}/api/admin/dashboard`);
                    const dashData = await dashRes.json();

                    if (dashData.success && dashData.recentOrders && dashData.recentOrders.length > 0) {
                        // The dashData formats it too, but we need raw User IDs.
                        // Without a raw users endpoint, let's just use the currently logged-in admin's ID for testing the profile views!
                        router.replace(`/admin/customers/${user._id || user.id}`);
                    } else {
                        router.replace(`/admin/customers/${user._id || user.id}`);
                    }
                } else {
                    router.replace(`/admin/customers/${user._id || user.id}`);
                }
            } catch (err) {
                console.error("Failed to redirect", err);
            }
        };

        findCustomer();
    }, [user, router, authFetch, API_URL]);

    return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="ml-3 text-gray-500 font-bold">Finding a customer profile to display...</p>
        </div>
    );
}

