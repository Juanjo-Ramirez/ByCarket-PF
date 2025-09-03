"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Star } from "lucide-react";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="relative bg-principal-blue text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-secondary-blue to-transparent z-0" />

      <div className="relative z-10 max-w-5xl mx-auto mt-16 mb-2 px-6 pt-28 md:pt-36 pb-20 md:pb-28 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          ¿Listo para dar el siguiente paso?
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mb-10">
          Crea tu cuenta gratis o accede a funciones exclusivas como usuario
          VIP. Potencia tu experiencia y encuentra el auto ideal o vende con
          ventajas únicas.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => router.push("/register")}
            className="flex items-center gap-2 bg-white text-principal-blue px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-gray-100 transition"
          >
            <UserPlus size={20} />
            Regístrate gratis
          </button>

          <button
            onClick={() => router.push("/dashboard/vip")}
            className="flex items-center gap-2 bg-secondary-blue text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-[#0c2b50] transition"
          >
            <Star size={20} />
            Hazte VIP
          </button>
        </div>
      </div>
    </section>
  );
}
