"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SellSection() {
  const router = useRouter();

  return (
    <section className="relative w-full overflow-hidden bg-secondary-blue">
      <div className="absolute top-0 left-0 w-full h-[100px] sm:h-[150px] md:h-[200px] z-0">
        <Image
          src="/assets/svg/sell-divider.svg"
          alt="Decoración superior"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 pt-50 pb-16 gap-20">
        <div className="w-full md:w-3/5 flex justify-center md:justify-end">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative w-full max-w-4xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl transition-transform"
          >
            <Image
              src="/assets/images/landing/SellSection-image.webp"
              alt="Imagen venta"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        <div className="w-full md:w-2/5 text-center md:text-left">
          <h3 className="text-yellow-300 font-semibold text-xl mb-2 uppercase tracking-wide">
            VENTA
          </h3>

          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Vendé tu vehículo sin
            <br />
            esfuerzo{" "}
            <span className="italic font-extrabold text-yellow-400">
              alguno
            </span>
          </h2>

          <p className="text-gray-100 text-base sm:text-lg mb-8 max-w-md mx-auto md:mx-0">
            Simplificamos tu venta con tecnología inteligente y procesos
            rápidos, para que no pierdas tiempo ni oportunidades.
          </p>

          <button
            onClick={() => router.push("/dashboard?tab=register-vehicle")}
            className="bg-principal-blue hover:bg-[#0c2c50] text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow transition"
          >
            Vende
          </button>
        </div>
      </div>
    </section>
  );
}
