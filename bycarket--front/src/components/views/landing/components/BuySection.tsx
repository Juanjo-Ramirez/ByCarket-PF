"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function BuySection() {
  const router = useRouter();

  return (
    <section className="relative w-full overflow-hidden bg-principal-blue">
      <div className="absolute top-0 left-0 w-full h-[100px] sm:h-[150px] md:h-[200px] z-0">
        <Image
          src="/assets/svg/buy-divider.svg"
          alt="Decoración superior"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 pt-50 pb-24 gap-20">
        <div className="w-full md:w-2/5 text-center md:text-right">
          <h3 className="text-yellow-300 font-semibold text-xl mb-2 uppercase tracking-wide">
            COMPRA
          </h3>

          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Comprá el vehículo
            <br />
            de tus{" "}
            <span className="italic font-extrabold text-yellow-400">
              sueños
            </span>
          </h2>

          <p className="text-gray-100 text-base sm:text-lg mb-8 max-w-md mx-auto md:ml-auto md:mr-0">
            Encuentra las mejores ofertas y acompáñanos en cada paso hasta que
            estés al volante de tu próximo auto.
          </p>

          <button
            onClick={() => router.push("/marketplace")}
            className="bg-secondary-blue hover:bg-[#35678c] text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow transition"
          >
            Compra
          </button>
        </div>

        <div className="w-full md:w-3/5 flex justify-center md:justify-start">
          <motion.img
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            src="/assets/images/landing/BuySection-image.webp"
            alt="Imagen compra"
            className="w-full h-auto rounded-3xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
