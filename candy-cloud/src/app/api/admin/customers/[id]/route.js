import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/apiError";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(request, { params }) {
    try {
        await connectDB();
        await requireAdmin(request);
        const { id } = await params;

        const customer = await User.findById(id).select("-password").lean();
        if (!customer) {
            return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
        }

        const orders = await Order.find({ user: id }).sort({ createdAt: -1 }).lean();
        const totalOrders = orders.length;
        const totalSpent = orders.filter((o) => o.orderStatus !== "cancelled").reduce((sum, order) => sum + order.total, 0);
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
        const magicPoints = Math.floor(totalSpent * 2);

        const formattedOrders = orders.map((order) => ({
            id: order.orderNumber,
            date: order.createdAt,
            amount: order.total,
            status: order.orderStatus,
        }));

        const journey = [];
        journey.push({
            id: "joined",
            title: "Joined Newsletter",
            description: 'Subscribed to "Sweet Treats Weekly"',
            date: customer.createdAt,
        });

        if (orders.length > 0) {
            const firstOrder = orders[orders.length - 1];
            let firstItemFlavor = "their first treat";
            if (firstOrder.items && firstOrder.items.length > 0) {
                firstItemFlavor = firstOrder.items[0].name;
            }
            journey.push({
                id: "first_order",
                title: "First Order Placed",
                description: `Order #${firstOrder.orderNumber.slice(-6).toUpperCase()} - ${firstItemFlavor}`,
                date: firstOrder.createdAt,
            });
        }

        if (customer.hasSpun) {
            const goldenOrder = orders.find((o) => o.discount > 0 || o.couponCode);
            const spinDate = goldenOrder ? goldenOrder.createdAt : new Date(new Date(customer.createdAt).getTime() + 86400000);
            journey.push({
                id: "golden_scoop",
                title: "Won a Golden Scoop",
                description: `Reached ${magicPoints} points milestone`,
                date: spinDate,
            });
        }

        journey.sort((a, b) => new Date(b.date) - new Date(a.date));

        let phone = "+1 (555) 000-0000";
        let location = "Unknown Location";
        if (orders.length > 0 && orders[0].shippingAddress) {
            const addr = orders[0].shippingAddress;
            if (addr.phone) phone = addr.phone;
            if (addr.city && addr.state) location = `${addr.city}, ${addr.state}`;
            else if (addr.city) location = addr.city;
        }

        const profile = {
            id: customer._id,
            name: customer.name,
            email: customer.email,
            phone,
            location,
            memberSince: customer.createdAt,
            isGoldenScoopWinner: customer.hasSpun || false,
        };

        return NextResponse.json({
            success: true,
            profile,
            kpis: { totalSpent, totalOrders, avgOrderValue, magicPoints },
            orders: formattedOrders,
            journey,
        });
    } catch (error) {
        return handleError(error);
    }
}
