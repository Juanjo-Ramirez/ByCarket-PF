import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Car,
  Calendar,
  Gauge,
  Users,
} from "lucide-react";
import { useHomeFeaturedProducts } from "@/hooks/useHomeFeaturedProducts";
import { useRouter } from "next/navigation";

export default function FeaturedProducts() {
  const router = useRouter();
  const { featuredProducts, loading, error } = useHomeFeaturedProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSlideChange = useCallback(
    (newIndex: number) => {
      if (!featuredProducts?.length) return;
      setDirection(newIndex > currentIndex ? 1 : -1);
      setCurrentIndex(
        ((newIndex % featuredProducts.length) + featuredProducts.length) %
          featuredProducts.length
      );
    },
    [currentIndex, featuredProducts?.length]
  );

  const nextSlide = () => handleSlideChange(currentIndex + 1);
  const prevSlide = () => handleSlideChange(currentIndex - 1);

  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      Active: "Activo",
      Used: "Usado",
      New: "Nuevo",
    };
    return translations[status] || status;
  };

  const translateCondition = (condition: string) => {
    const translations: Record<string, string> = {
      new: "Nuevo",
      used: "Usado",
    };
    return translations[condition] || condition;
  };

  const handleViewDetail = (postId: string) => {
    router.push(`/marketplace/${postId}`);
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      <div className="h-48 w-full bg-gray-200"></div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="mt-auto pt-3">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="flex justify-between items-center mt-2">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-principal-blue mb-2">
            Productos Destacados
          </h2>
          <p className="text-secondary-blue">
            Descubre nuestros vehículos más populares
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-principal-blue mb-2">
            Productos Destacados
          </h2>
          <p className="text-secondary-blue">
            Descubre nuestros vehículos más populares
          </p>
        </div>
        <div className="text-center">
          <Car className="h-16 w-16 text-secondary-blue mx-auto mb-4" />
          <p className="text-principal-blue">
            {error
              ? "Error al cargar los productos destacados"
              : "No hay productos destacados disponibles"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-principal-blue mb-2">
          Productos Destacados
        </h2>
        <p className="text-secondary-blue">
          Descubre nuestros vehículos más populares
        </p>
      </div>

      <div className="relative">
        <div className="flex justify-center items-center overflow-visible">
          <div className="relative w-full h-[500px] flex justify-center items-center">
            {featuredProducts.map((product, index) => {
              const isActive = index === currentIndex;
              const offset =
                (index - currentIndex + featuredProducts.length) %
                featuredProducts.length;
              const position =
                offset > featuredProducts.length / 2
                  ? offset - featuredProducts.length
                  : offset < -featuredProducts.length / 2
                  ? offset + featuredProducts.length
                  : offset;

              const isVisible = Math.abs(position) <= (isMobile ? 0 : 1);
              if (!isVisible) return null;

              return (
                <motion.div
                  key={product.id || index}
                  initial={{
                    x: direction * 500,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    x: isMobile ? 0 : position * 320,
                    opacity: isActive ? 1 : isMobile ? 0.4 : 0.7,
                    scale: isActive ? 1 : isMobile ? 0.9 : 0.85,
                    zIndex: isActive ? 3 : 2 - Math.abs(position),
                  }}
                  exit={{
                    x: direction * -500,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 45,
                    damping: 20,
                    mass: 0.8,
                  }}
                  className="absolute w-80 md:w-72 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    filter: isActive ? "none" : "brightness(0.9)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative h-48 bg-gradient-to-br from-principal-blue to-secondary-blue flex items-center justify-center overflow-hidden">
                      {product.vehicle.images &&
                      product.vehicle.images.length > 0 ? (
                        <img
                          src={product.vehicle.images[0].secure_url}
                          alt={`${product.vehicle.brand.name} ${product.vehicle.model.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Car className="h-20 w-20 text-white opacity-90 z-10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                        <span className="text-white text-sm font-medium">
                          {translateStatus(product.status)}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-principal-blue mb-2 truncate">
                        {`${product.vehicle.brand.name} ${product.vehicle.model.name}`}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {product.vehicle.description ||
                          "Descripción del vehículo no disponible"}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-secondary-blue flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {product.vehicle.year}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-secondary-blue flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {product.vehicle.mileage.toLocaleString()} km
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-secondary-blue flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {product.vehicle.typeOfVehicle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-secondary-blue flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {translateCondition(product.vehicle.condition)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-principal-blue">
                            {product.vehicle.currency} $
                            {product.vehicle.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">Precio final</p>
                        </div>
                        <button
                          onClick={() => handleViewDetail(product.id)}
                          className="bg-principal-blue text-white px-5 py-2.5 rounded-lg hover:bg-secondary-blue transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          Ver más
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-200 z-[60] border border-gray-100 hover:shadow-2xl transform hover:scale-110"
          disabled={featuredProducts.length <= 1}
        >
          <ChevronLeft className="h-6 w-6 text-principal-blue" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-200 z-[60] border border-gray-100 hover:shadow-2xl transform hover:scale-110"
          disabled={featuredProducts.length <= 1}
        >
          <ChevronRight className="h-6 w-6 text-principal-blue" />
        </button>
      </div>

      <div className="flex justify-center mt-8 gap-3">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-3 bg-principal-blue"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
