export default function Marquee() {
    const items = [
        "✨ Cute Accessories",
        "🎀 Hair Ties & Clips",
        "📓 Dreamy Planners",
        "💄 Beauty & Cosmetics",
        "🌈 Mystery Boxes",
        "💎 Earrings & Rings",
        "🖊️ Multicolor Pens",
        "🎁 Custom Gift Boxes",
    ];

    return (
        <div className="overflow-hidden bg-yellow py-3.5 whitespace-nowrap">
            <div className="inline-flex gap-10 animate-scroll">
                {[...items, ...items].map((item, i) => (
                    <span key={i} className="text-sm font-semibold text-dark whitespace-nowrap">
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
