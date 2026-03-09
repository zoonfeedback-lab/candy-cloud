import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import SpecialDeals from "@/components/SpecialDeals";
import HomeShopByCategory from "@/components/HomeShopByCategory";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <SpecialDeals />
      {/* <HomeShopByCategory /> */}
      <HowItWorks />
      <Gallery />
      <Features />
      <FAQ />
      <Footer />
    </>
  );
}
