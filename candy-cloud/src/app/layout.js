import { Outfit } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "CandyCloud — Order Your Scoop Today",
  description:
    "CandyCloud is your magical candy shop. Customize your magic bundle, explore our collection of lollipops, chocolates, gummies & more!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
