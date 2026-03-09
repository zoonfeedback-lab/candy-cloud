import OrderHistory from "@/components/OrderHistory";

export const metadata = {
    title: "My Orders | CandyCloud",
    description: "View your CandyCloud order history and track deliveries",
};

export default function OrdersPage() {
    return <OrderHistory />;
}
