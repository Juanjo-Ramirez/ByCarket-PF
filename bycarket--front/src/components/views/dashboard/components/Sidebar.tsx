"use client";

import {
  User,
  Car,
  FileText,
  Crown,
  PlusCircle,
  Users,
  Menu,
  X,
  Gem,
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useState, useEffect } from "react";
import Image from "next/image";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { userData } = useUserData();
  const { isAdmin, isPremium } = useRolePermissions();
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (userData?.image) {
      setImageKey((prevKey) => prevKey + 1);
    }
  }, [userData?.image]);

  const baseMenuItems = [
    { id: "profile", label: "Datos Personales", icon: User },
    { id: "vehicles", label: "Mis vehículos", icon: Car },
    { id: "publications", label: "Mis publicaciones", icon: FileText },
    {
      id: "register-vehicle",
      label: "Registrar un vehículo",
      icon: PlusCircle,
    },
    { id: "premium", label: "Premium", icon: Crown },
  ];

  const premiumItems = [
    { id: "premium", label: "Premium", icon: Crown },
    { id: "premium-history", label: "Historial Premium", icon: Gem },
  ];

  const menuItems = isAdmin
    ? [
        ...baseMenuItems.filter(
          (item) => !premiumItems.some((pi) => pi.id === item.id)
        ),
        { id: "users", label: "Lista de usuarios", icon: Users },
        { id: "user-posts", label: "Lista de publicaciones", icon: FileText },
        { id: "database-scrapper", label: "Scrapper", icon: FileText },
      ]
    : isPremium
    ? [
        ...baseMenuItems.filter(
          (item) => !premiumItems.some((pi) => pi.id === item.id)
        ),
        ...premiumItems,
      ]
    : baseMenuItems.filter(
        (item) => !premiumItems.some((pi) => pi.id === item.id)
      );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed bottom-4 left-4 z-50 p-3 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-72 md:w-64
          border-r border-gray-100 bg-white/95 backdrop-blur-lg
          transform transition-transform duration-300 ease-in-out
          shadow-xl md:shadow-none
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6 md:p-4 lg:p-6">
            <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-[#103663]/10 to-[#4a77a8]/10 rounded-2xl border border-[#4a77a8]/20">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#103663] to-[#4a77a8] flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden group">
                {userData?.image &&
                typeof userData.image === "string" &&
                userData.image.trim() !== "" ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      key={`profile-image-${imageKey}`}
                      src={`${userData.image}?t=${Date.now()}`}
                      alt={userData.name || "Usuario"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      priority
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-lg font-bold">
                    {userData?.name ? getInitials(userData.name) : "U"}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-lg truncate">
                  {userData?.name || "Usuario"}
                </h2>
                <p className="text-sm text-gray-600 truncate">
                  @
                  {userData?.name ||
                    (userData?.email
                      ? userData.email.split("@")[0]
                      : "usuario")}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in-up"
                >
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    onMouseEnter={() => setIsHovered(item.id)}
                    onMouseLeave={() => setIsHovered(null)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left
                      transition-all duration-300 ease-out group relative overflow-hidden
                      ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white shadow-lg shadow-[#4a77a8]/25 transform scale-[1.02]"
                          : "text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01]"
                      }
                    `}
                  >
                    <div
                      className={`
                        absolute inset-0 bg-gradient-to-r from-[#103663]/10 to-[#4a77a8]/10
                        transform transition-transform duration-300 ease-out
                        ${
                          isHovered === item.id && activeTab !== item.id
                            ? "translate-x-0"
                            : "-translate-x-full"
                        }
                      `}
                    />

                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-xl
                        transition-all duration-300 ease-out relative z-10
                        ${
                          activeTab === item.id
                            ? "bg-white/20 shadow-lg"
                            : "bg-gray-100 group-hover:bg-[#4a77a8]/10"
                        }
                      `}
                    >
                      <item.icon
                        className={`
                          w-5 h-5 transition-all duration-300 ease-out
                          ${
                            activeTab === item.id
                              ? "text-white"
                              : "text-gray-600 group-hover:text-[#4a77a8]"
                          }
                          ${isHovered === item.id ? "scale-110 rotate-3" : ""}
                        `}
                      />
                    </div>

                    <span
                      className={`
                      font-medium transition-all duration-300 relative z-10
                      ${
                        activeTab === item.id
                          ? "text-white"
                          : "text-gray-700 group-hover:text-gray-900"
                      }
                    `}
                    >
                      {item.label}
                    </span>

                    {activeTab === item.id && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
