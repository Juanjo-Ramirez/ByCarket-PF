"use client";

import { Mail, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-6 py-16 flex flex-col items-center space-y-8">
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/assets/images/logo/Logoo.webp"
            alt="ByCarket logo"
            width={40}
            height={40}
            className="h-10 w-12"
          />
          <span className="text-2xl sm:text-3xl font-semibold text-principal-blue">
            ByCarket
          </span>
        </Link>

        <p className="text-center max-w-lg text-base text-gray-600">
          Conectamos compradores y vendedores de autos de forma simple, rápida y
          segura.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <a
            href="mailto:bycarket@gmail.com"
            className="flex items-center gap-2 text-gray-600 hover:text-principal-blue transition text-base"
          >
            <Mail size={22} />
            bycarket@gmail.com
          </a>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              href="https://www.facebook.com/share/16QjEuYh3H/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 hover:text-principal-blue transition"
              aria-label="Facebook"
            >
              <Facebook size={22} />
              <span>ByCarket</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-1 text-gray-600 hover:text-principal-blue transition"
              aria-label="Instagram"
            >
              <Instagram size={22} />
              <span>ByCarket</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-principal-blue/20 w-full"></div>

      <div className="py-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} ByCarket. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
