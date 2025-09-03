"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Post {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  postDate?: string;
  createdAt?: string;
  images?: Array<{ secure_url: string }>;
  vehicle?: {
    brand?: { name: string };
    model?: { name: string };
    version?: { name: string };
    year?: number;
    price?: number;
    currency?: string;
    mileage?: number;
    condition?: string;
    typeOfVehicle?: string;
    images?: Array<{ secure_url: string }>;
  };
}

interface PostCarouselProps {
  posts: Post[];
}

const PostCarousel = ({ posts }: PostCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<
    Record<string | number, boolean>
  >({});

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No hay más publicaciones de este vendedor
        </p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const handleImageError = (postId: string | number) => {
    setImageErrors((prev) => ({ ...prev, [postId]: true }));
  };

  const handleViewDetail = (post: Post) => {
    if (post?.id) {
      window.location.href = `/marketplace/${post.id}`;
    }
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Más vehículos del vendedor
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#103663] to-[#4a77a8] mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: `${-currentIndex * 100}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {posts.map((post) => {
                const getFormattedDate = (dateString?: string) => {
                  if (!dateString) return "Fecha no disponible";
                  try {
                    const date = new Date(dateString);
                    return isNaN(date.getTime())
                      ? "Fecha no disponible"
                      : date.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                  } catch (error) {
                    return "Fecha no disponible";
                  }
                };

                const formattedDate = getFormattedDate(
                  post.postDate || post.createdAt
                );

                const vehicleImage =
                  post.vehicle?.images?.[0]?.secure_url &&
                  !imageErrors[parseInt(post.id) || 0]
                    ? post.vehicle.images[0].secure_url
                    : "/placeholder-vehicle.jpg";

                const vehicleName = `${post.vehicle?.brand?.name || ""} ${
                  post.vehicle?.model?.name || ""
                } ${post.vehicle?.version?.name || ""}`.trim();

                return (
                  <motion.div
                    key={post.id}
                    className="w-full flex-shrink-0 px-2 sm:px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-500 transform hover:-translate-y-1 max-w-md mx-auto">
                      <div className="relative">
                        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                          <Image
                            src={vehicleImage}
                            alt={vehicleName}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={() =>
                              handleImageError(parseInt(post.id) || 0)
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        <div className="absolute top-4 left-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm bg-blue-50 text-[#103663] border-[#4a77a8]/30">
                            <div className="w-1.5 h-1.5 bg-[#4a77a8] rounded-full" />
                            {formattedDate}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-[#103663] transition-colors duration-300">
                            {vehicleName}
                          </h3>

                          <div className="flex items-center gap-3 text-sm text-slate-500 mb-3 flex-wrap">
                            <span className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                              {post.vehicle?.year}
                            </span>
                            {post.vehicle?.mileage !== undefined && (
                              <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                {post.vehicle.mileage.toLocaleString()} km
                              </span>
                            )}
                            {post.vehicle?.condition && (
                              <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                {post.vehicle.condition === "used"
                                  ? "Usado"
                                  : "Nuevo"}
                              </span>
                            )}
                          </div>

                          <div className="text-2xl font-bold text-[#103663] mb-1">
                            {post.vehicle?.currency}{" "}
                            {post.vehicle?.price?.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleViewDetail(post)}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white text-sm font-medium rounded-xl hover:from-[#0d2a4f] hover:to-[#3d6291] transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
                          >
                            Ver detalle
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {posts.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full p-2 sm:p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-110 group z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#103663] group-hover:text-[#4a77a8] transition-colors duration-300" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full p-2 sm:p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-110 group z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#103663] group-hover:text-[#4a77a8] transition-colors duration-300" />
              </button>

              <div className="flex justify-center mt-8 gap-2">
                {posts.map((post: Post, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-[#103663] scale-125"
                        : "bg-slate-300 hover:bg-[#4a77a8]"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostCarousel;
