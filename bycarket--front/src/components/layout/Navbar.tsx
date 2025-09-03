"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/context/AuthContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { showSuccess } from "@/app/utils/Notifications";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const { status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = isAuthenticated || status === "authenticated";
      setIsUserAuthenticated(isAuth);
    };

    checkAuth();
  }, [isAuthenticated, status]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (status === "authenticated") {
        await signOut({ redirect: false });
      }
      logout();

      showSuccess("Sesión cerrada correctamente");

      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="relative py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/home"
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/assets/images/logo/Logoo.webp"
            alt="logoByCarket"
            width={40}
            height={40}
            className="h-10 w-12"
          />
          <span className="text-xl font-semibold text-principal-blue">
            ByCarket
          </span>
        </Link>

        <div className="hidden space-x-6 md:flex ">
          {[
            { href: "/home", label: "Inicio" },
            { href: "/marketplace", label: "Vehiculos" },
            { href: "/suscription", label: "Premium" },
            { href: "/contact", label: "Contacto" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={`relative transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-principal-blue ${
                pathname === href
                  ? "text-principal-blue after:w-full"
                  : "text-principal-blue after:w-0 hover:after:w-full"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden space-x-2 md:flex">
          {isUserAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-md bg-principal-blue px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg hover:translate-y-[-2px]"
              >
                <FaUser size={18} />
                <span>Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-md border border-secondary-blue px-4 py-2 text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiLogOut size={18} />
                <span>{isLoggingOut ? "Cerrando..." : "Cerrar sesión"}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-secondary-blue px-4 py-2 text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md hover:translate-y-[-2px]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-principal-blue px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg hover:translate-y-[-2px]"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="text-principal-blue transition-transform duration-200 hover:scale-110 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="mx-auto mt-3 h-0.5 w-[70%] bg-secondary-blue"></div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src="/assets/images/logo/Logoo.webp"
                  alt="logoByCarket"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="text-xl font-semibold text-principal-blue">
                  ByCarket
                </span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="transition-transform duration-200 hover:scale-110 hover:rotate-90"
              >
                <X className="h-6 w-6 text-principal-blue" />
              </button>
            </div>

            <div className="mt-8 flex flex-col space-y-4">
              {[
                { href: "/home", label: "Inicio" },
                { href: "/marketplace", label: "Vehiculos" },
                { href: "/suscription", label: "Premium" },
                { href: "/contact", label: "Contacto" },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-lg text-principal-blue transition-all duration-300 ease-in-out hover:pl-2 hover:text-secondary-blue"
                  onClick={toggleMobileMenu}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-2 pb-8">
              {isUserAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-principal-blue px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg"
                    onClick={toggleMobileMenu}
                  >
                    <FaUser size={18} />
                    <span>Perfil</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    disabled={isLoggingOut}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-secondary-blue px-4 py-2 text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiLogOut size={18} />
                    <span>
                      {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full rounded-md border border-secondary-blue px-4 py-2 text-center text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md"
                    onClick={toggleMobileMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full rounded-md bg-principal-blue px-4 py-2 text-center text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg"
                    onClick={toggleMobileMenu}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
