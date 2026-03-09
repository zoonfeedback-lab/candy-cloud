"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";

const PRIZES = [
    { label: "Mystery Item 3", color: "#e9d5ff", text: "#4c1d95" },
    { label: "10% OFF", color: "#fbcfe8", text: "#831843" },
    { label: "Mystery Item 1", color: "#f3f4f6", text: "#374151" },
    { label: "Free Shipping", color: "#bae6fd", text: "#0c4a6e" },
    { label: "Mystery Item 2", color: "#fef08a", text: "#713f12" },
    { label: "Free Sticker", color: "#a7f3d0", text: "#064e3b" },
];

export default function PrizeSpinner() {
    const { isAuthenticated, openAuthModal, authFetch, API_URL } = useAuth();
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [prize, setPrize] = useState(null);
    const [rotation, setRotation] = useState(0);

    // Reset spinner when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            setHasSpun(false);
            setPrize(null);
            setRotation(0);
        }
    }, [isAuthenticated]);

    const handleSpinClick = () => {
        if (!isAuthenticated) {
            openAuthModal("login");
            return;
        }
        if (isSpinning || hasSpun) return;
        spinWheel();
    };

    const spinWheel = async () => {
        setIsSpinning(true);
        setPrize(null);

        try {
            const res = await authFetch(`${API_URL}/api/rewards/spin`, {
                method: "POST"
            });
            const data = await res.json();

            if (!data.success) {
                setIsSpinning(false);
                setPrize({ label: "Try Again", error: data.message });
                setHasSpun(true);
                return;
            }

            const winningIndex = data.winningIndex;
            const wonPrize = PRIZES[winningIndex];

            // Calculate rotation to land exactly on the winning slice
            const extraSpins = Math.floor(Math.random() * 5 + 5) * 360;
            const sliceAngle = 360 / PRIZES.length;

            // The slice center angle
            // Math backwards to ensure normalizedRotation matches the slice
            // Slice i ranges from (i * sliceAngle - sliceAngle/2) to (i * sliceAngle + sliceAngle/2)
            // But visually, index 0 is at top (-90 offset in SVG originally).
            // Actually, the previous math: winningIndex = Math.floor(((360 - normalizedRotation + sliceAngle / 2) % 360) / sliceAngle)
            // Reverse engineering it to get a valid normalizedRotation:
            const targetRotation = 360 - (winningIndex * sliceAngle);

            // Add a little randomness within the slice so it doesn't always land dead center
            const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.8);

            const totalRotation = rotation + extraSpins + targetRotation + randomOffset;

            setRotation(totalRotation);

            setTimeout(() => {
                setIsSpinning(false);
                setHasSpun(true);
                setPrize({ ...wonPrize, couponCode: data.coupon.code });
                if (wonPrize.label !== "Try Again") {
                    triggerConfetti();
                }
            }, 5000);

        } catch (error) {
            console.error(error);
            setIsSpinning(false);
            setPrize({ label: "Try Again", error: "Connection error. Try again later." });
            setHasSpun(true);
        }
    };

    const triggerConfetti = () => {
        try {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f472b6', '#38bdf8', '#c084fc', '#facc15']
            });
        } catch (e) {
            console.log("Confetti failed to load");
        }
    };

    const getPathData = (index, total) => {
        const startAngle = (index * 360) / total - 90;
        const endAngle = ((index + 1) * 360) / total - 90;
        const startX = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
        const startY = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
        const endX = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
        const endY = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return ["M", 50, 50, "L", startX, startY, "A", 50, 50, 0, largeArcFlag, 1, endX, endY, "Z"].join(" ");
    };

    const getTextTransform = (index, total) => {
        const angle = (index * 360) / total + (360 / total) / 2;
        return `rotate(${angle} 50 50) translate(0, -35)`;
    };

    return (
        <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
            {/* The Spinner Wheel SVG */}
            <div className="relative w-[360px] h-[360px] md:w-[420px] md:h-[420px] filter drop-shadow-[0_10px_20px_rgba(244,114,182,0.3)]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-pink shadow-lg filter drop-shadow-md"></div>

                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full rounded-full border-4 border-white shadow-xl"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                    }}
                >
                    <g>
                        {PRIZES.map((p, i) => (
                            <path key={i} d={getPathData(i, PRIZES.length)} fill={p.color} stroke="white" strokeWidth="0.5" />
                        ))}
                    </g>
                    <g className="font-bold text-[5px]" style={{ fontFamily: "inherit" }}>
                        {PRIZES.map((p, i) => (
                            <text key={i} x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={p.text} transform={getTextTransform(i, PRIZES.length)}>
                                {p.label}
                            </text>
                        ))}
                    </g>
                    <circle cx="50" cy="50" r="12" fill="white" />
                    <circle cx="50" cy="50" r="9" fill="#fdf2f8" />
                </svg>

                <button
                    onClick={handleSpinClick}
                    disabled={isSpinning || hasSpun}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-pink text-white font-bold text-lg shadow-[0_0_15px_rgba(244,114,182,0.5)] border-4 border-white hover:scale-105 transition-transform disabled:hover:scale-100 disabled:opacity-80 active:scale-95 flex flex-col items-center justify-center leading-tight"
                >
                    {hasSpun ? "SPUN!" : (
                        <>
                            <span>SPIN</span>
                            <span className="text-xs font-medium">✨</span>
                        </>
                    )}
                </button>
            </div>

            {/* Prize Won Message */}
            {prize && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%] bg-white p-4 rounded-2xl shadow-xl border border-pink-100 text-center animate-bounce-short">
                    {prize.label === "Try Again" ? (
                        <>
                            <span className="text-2xl block mb-1">🥺</span>
                            <p className="font-bold text-dark text-lg">Aw, no luck this time!</p>
                            <p className="text-sm text-gray-500">{prize.error || "Thanks for playing!"}</p>
                        </>
                    ) : (
                        <>
                            <span className="text-2xl block mb-1">🎊</span>
                            <p className="text-sm text-gray-500 font-medium">You won:</p>
                            <p className="font-black text-pink text-2xl tracking-tight">{prize.label}!</p>
                            {prize.couponCode && (
                                <div className="mt-2 bg-pink-50 border border-pink-200 rounded-lg p-2 font-mono text-pink-600 font-bold select-all tracking-wider">
                                    {prize.couponCode}
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">Copy this code to use at checkout!</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
