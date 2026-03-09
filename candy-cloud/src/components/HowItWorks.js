import Image from "next/image";

const steps = [
    {
        num: "01",
        title: "Pick Your Favorites",
        desc: "Browse our dreamy catalogue and handpick your favorite stationery, cosmetics, and cute accessories.",
        bg: "bg-pink-light",
    },
    {
        num: "02",
        title: "We Assemble Magic",
        desc: "Our candy artisans carefully pack your selections into a beautiful, themed gift box.",
        bg: "bg-[#e0f7fa]",
    },
    {
        num: "03",
        title: "Unwrap Joy",
        desc: "Receive your magical bundle at your doorstep and enjoy your cute new haul!",
        bg: "bg-yellow",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 bg-gray-100">
            <div className="max-w-[1200px] mx-auto px-5">
                <h2 className="text-3xl font-bold text-center mb-3">
                    How the Magic Happens <span>✨</span>
                </h2>
                <p className="text-base text-gray-500 text-center mb-12 max-w-[600px] mx-auto">
                    We make gifting effortless. Just 3 simple steps to your aesthetic haul!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                    {steps.map((step) => (
                        <div
                            key={step.num}
                            className={`${step.bg} rounded-xl p-7 text-center hover:-translate-y-1.5 hover:shadow-md transition-all`}
                        >
                            <div className="rounded-lg overflow-hidden mb-5">
                                <Image
                                    src="/images/how-it-works.png"
                                    alt={step.title}
                                    width={280}
                                    height={200}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white font-bold text-sm text-pink shadow-sm mb-3">
                                {step.num}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
