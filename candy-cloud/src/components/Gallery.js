import Image from "next/image";

export default function Gallery() {
    return (
        <section className="py-20 bg-pink-light">
            <div className="max-w-[1200px] mx-auto px-5">
                <h2 className="text-3xl font-bold text-center mb-3">
                    Peek Inside the Magic <span>✨</span>
                </h2>
                <p className="text-base text-gray-500 text-center mb-12 max-w-[600px] mx-auto">
                    A glimpse into our colorful candy world — every box is a work of art!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] grid-rows-[auto_auto] gap-4">
                    <div className="md:row-span-2 rounded-xl overflow-hidden group">
                        <Image
                            src="/images/gallery-candy.png"
                            alt="Colorful candy bowl"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden group">
                        <Image
                            src="/images/hero-candy.png"
                            alt="Candy assortment"
                            width={300}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden group">
                        <Image
                            src="/images/candy-categories.png"
                            alt="Candy categories"
                            width={300}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
