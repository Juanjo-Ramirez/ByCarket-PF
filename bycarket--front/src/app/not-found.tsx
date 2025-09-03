import Image from "next/image";
import Link from "next/link";
import crashIllustration from "../../public/illustrations/404-car-crash.svg";

export default function NotFound() {
  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-principal-blue z-0" />

      <div className="absolute bottom-0 left-0 w-full z-10">
        <svg
          className="w-full h-[150px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,224L48,197.3C96,171,192,117,288,128C384,139,480,213,576,229.3C672,245,768,203,864,176C960,149,1056,139,1152,144C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-20 flex flex-col items-center text-center text-white px-6">
        <Image
          src={crashIllustration}
          alt="Auto perdido"
          width={300}
          height={300}
          className="mb-8"
        />
        <h1 className="text-4xl font-bold mb-4">404 – Página no encontrada</h1>
        <p className="mb-6 text-white/80">
          Ups… parece que este auto tomó otro camino.
        </p>
        <Link
          href="/"
          className="bg-white text-principal-blue px-6 py-3 rounded-2xl shadow hover:bg-gray-100 transition font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
