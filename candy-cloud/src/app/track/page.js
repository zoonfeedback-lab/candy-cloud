import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackOrder from "@/components/TrackOrder";

export const metadata = {
    title: "Track Order | CandyCloud",
    description: "Track your CandyCloud order status in real-time",
};

export default function TrackPage() {
    return (
        <>
            <Navbar />
            <TrackOrder />
            <Footer />
        </>
    );
}
