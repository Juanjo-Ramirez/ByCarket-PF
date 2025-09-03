"use client";

import Image from "next/image";

export default function Hero() {
  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-principal-blue py-16 px-6 text-left overflow-hidden">
      <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full bg-secondary-blue md:rounded-bl-[120px] z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <div className="md:w-1/2 text-white pl-6 md:pl-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">ByCarket</h1>
          <p className="text-4xl md:text-5xl mb-8 leading-snug">
            <span className="text-white/70">
              Nunca fue
              <br />
              tan <span className="font-bold italic text-[#facc15]">fácil</span>
              <br />
              vender tu
              <br />
              auto
            </span>
          </p>
          <button
            onClick={scrollToHowItWorks}
            className="bg-[#facc15] text-gray-900 hover:bg-yellow-500 font-semibold px-6 py-3 rounded-2xl shadow transition"
          >
            Descubre
          </button>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end">
          <div className="relative mx-auto md:mx-0 w-[100%] md:w-[95%] lg:w-[90%] max-w-[800px] h-auto">
            <Image
              src="/assets/images/landing/hero-image.webp"
              alt="Decoración Hero"
              width={1200}
              height={800}
              className="w-[100%] md:w-[95%] lg:w-[90%] max-w-[800px] h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
