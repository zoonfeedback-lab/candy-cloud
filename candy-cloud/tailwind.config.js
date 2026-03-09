/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                pink: {
                    DEFAULT: "#f472b6",
                    dark: "#ec4899",
                    light: "#fce4ec",
                    bg: "#fff0f5",
                },
                yellow: {
                    DEFAULT: "#fef9c3",
                    accent: "#facc15",
                    dark: "#eab308",
                },
                teal: {
                    DEFAULT: "#3b8c8c",
                },
                dark: "#1e1e1e",
            },
            fontFamily: {
                outfit: ["var(--font-outfit)", "sans-serif"],
            },
            borderRadius: {
                xl: "20px",
                "2xl": "30px",
            },
            keyframes: {
                scroll: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                floatUp: {
                    "0%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(-14px)" },
                },
                morphBlob: {
                    "0%, 100%": { borderRadius: "60% 40% 50% 45% / 50% 55% 45% 50%" },
                    "25%": { borderRadius: "45% 55% 40% 60% / 55% 45% 55% 45%" },
                    "50%": { borderRadius: "50% 45% 55% 50% / 45% 50% 50% 55%" },
                    "75%": { borderRadius: "55% 50% 45% 55% / 50% 55% 45% 50%" },
                },
                twinkle: {
                    "0%, 100%": { transform: "scale(1)", opacity: "1" },
                    "50%": { transform: "scale(1.3)", opacity: "0.7" },
                },
                floatSlow: {
                    "0%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(-16px)" },
                },
                pulse2: {
                    "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
                    "50%": { transform: "scale(1.2)", opacity: "1" },
                },
                slideDown: {
                    from: { opacity: "0", transform: "translateY(-8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                scroll: "scroll 25s linear infinite",
                floatUp: "floatUp 4s ease-in-out infinite alternate",
                morphBlob: "morphBlob 8s ease-in-out infinite",
                twinkle: "twinkl`e 2.5s ease-in-out infinite",
                floatSlow: "floatSlow 5s ease-in-out infinite alternate",
                "spin-slow": "spin 10s linear infinite",
                "spin-slower": "spin 15s linear infinite",
                "spin-8": "spin 8s linear infinite",
                pulse2: "pulse2 2s ease-in-out infinite",
                slideDown: "slideDown 0.25s ease",
            },
        },
    },
    plugins: [],
};
