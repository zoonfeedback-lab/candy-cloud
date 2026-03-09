const features = [
    { icon: "🚚", title: "Safe Delivery", desc: "Your items arrive safe and perfectly packed, every single time." },
    { icon: "✨", title: "Cute Goodies", desc: "Only the finest, aesthetic treats handpicked for you." },
    { icon: "🔒", title: "Safe Pay", desc: "Secure checkout with all major payment methods supported." },
];

export default function Features() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((f) => (
                    <div key={f.title} className="text-center p-8 rounded-xl bg-gray-100 hover:-translate-y-1.5 hover:shadow-md transition-all">
                        <div className="text-4xl mb-4">{f.icon}</div>
                        <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
