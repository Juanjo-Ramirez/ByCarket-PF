"use client";

import { useState } from "react";
import { useOptimizedUserData } from "@/hooks/queries/useUserQueries";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";
import {
  FiX,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiTruck,
  FiInfo,
  FiTag,
} from "react-icons/fi";

type PostsDetailProps = {
  post: PostResponse;
  onClose: () => void;
  onDelete?: (id: string) => Promise<boolean>;
};

export default function PostsDetail({
  post,
  onClose,
  onDelete,
}: PostsDetailProps) {
  const { userData: user } = useOptimizedUserData();
  const isPremiumUser = user?.role === "premium" || user?.role === "admin";
  const isAdminUser = user?.role === "admin";
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const vehicle = post?.vehicle;
  const images = vehicle?.images || [];
  const currentImage =
    images.length > 0
      ? images[currentImageIndex]?.secure_url
      : "/assets/images/default-car.png";

  const vehicleName =
    [vehicle?.brand?.name, vehicle?.model?.name, vehicle?.version?.name]
      .filter(Boolean)
      .join(" ")
      .trim() || "Vehículo sin nombre";

  const formattedDate = post?.postDate
    ? new Date(post.postDate).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Fecha no disponible";

  const statusColors: Record<string, string> = {
    published: "bg-green-300 text-green-800",
    active: "bg-green-300 text-green-800",
    draft: "bg-yellow-300 text-yellow-800",
    sold: "bg-red-300 text-red-800",
    inactive: "bg-gray-300 text-gray-800",
    default: "bg-yellow-300 text-blue-800",
  };

  const statusText: Record<string, string> = {
    published: "Publicado",
    active: "Activo",
    draft: "Borrador",
    sold: "Vendido",
    inactive: "Inactivo",
    default: post?.status || "Estado desconocido",
  };

  const statusClass =
    statusColors[post?.status?.toLowerCase() || "default"] ||
    statusColors.default;
  const statusLabel =
    statusText[post?.status?.toLowerCase() || "default"] || statusText.default;

  const handleDelete = async () => {
    if (!onDelete || !post?.id) return;

    if (confirm("¿Estás seguro de eliminar esta publicación?")) {
      setIsDeleting(true);
      const success = await onDelete(post.id);
      if (success) {
        onClose();
      } else {
        setIsDeleting(false);
      }
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex flex-col items-center py-4 px-2 sm:px-4">
        <div className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] px-4 py-4 md:px-8 md:py-6 text-white">
            <div className="flex justify-between items-center">
              <div className="truncate pr-2">
                <h2 className="text-xl md:text-2xl font-bold truncate">
                  {vehicleName}
                </h2>
                <p className="text-blue-100 opacity-90 text-sm">
                  Detalles de la publicación
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 md:p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              >
                <FiX className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-2 sm:p-4 bg-gray-50">
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg md:rounded-xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={currentImage}
                  alt={vehicleName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <FiChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-[#103663]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <FiChevronRight className="h-4 w-4 md:h-5 md:w-5 text-[#103663]" />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className="w-2 h-2 rounded-full transition-all"
                          style={{
                            backgroundColor:
                              idx === currentImageIndex
                                ? "#103663"
                                : "rgba(255,255,255,0.6)",
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-2 sm:mt-4 flex overflow-x-auto gap-2 py-2">
                  {images.map((image, index) => (
                    <div
                      key={image.public_id}
                      className="relative aspect-square w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden"
                      style={{
                        opacity: index === currentImageIndex ? 1 : 0.7,
                        boxShadow:
                          index === currentImageIndex
                            ? "0 0 0 2px #103663"
                            : "none",
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image.secure_url}
                        alt={`${vehicleName} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FiDollarSign className="h-6 w-6 md:h-8 md:w-8" />
                    <div>
                      <p className="text-blue-100 text-sm">Precio</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {vehicle?.currency}{" "}
                        {vehicle?.price?.toLocaleString() ?? "N/A"}
                      </p>
                      {post?.isNegotiable && (
                        <span className="mt-2 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          Negociable
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl">
                  <h3 className="text-lg md:text-xl font-bold text-[#103663] mb-4 flex items-center gap-2">
                    <FiTruck className="h-5 w-5" />
                    Información del vehículo
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiTruck className="h-4 w-4" />
                        Marca
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {vehicle?.brand?.name ?? "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiTruck className="h-4 w-4" />
                        Modelo
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {vehicle?.model?.name ?? "N/A"}
                      </p>
                    </div>
                    {vehicle?.version?.name && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FiInfo className="h-4 w-4" />
                          Versión
                        </p>
                        <p className="font-semibold text-[#103663]">
                          {vehicle.version.name}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiCalendar className="h-4 w-4" />
                        Año
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {vehicle?.year ?? "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiActivity className="h-4 w-4" />
                        Kilometraje
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {vehicle?.mileage
                          ? `${vehicle.mileage.toLocaleString()} km`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiInfo className="h-4 w-4" />
                        Condición
                      </p>
                      <p className="font-semibold text-[#103663] capitalize">
                        {vehicle?.condition ?? "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiTag className="h-4 w-4" />
                        Tipo de vehículo
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {vehicle?.typeOfVehicle ?? "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {vehicle?.description && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-bold text-[#103663] mb-3 flex items-center gap-2">
                      <FiInfo className="h-5 w-5" />
                      Descripción
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {vehicle.description}
                    </p>
                  </div>
                )}

                <div className="bg-white border border-gray-200 p-4 rounded-xl">
                  <h3 className="text-xl font-bold text-[#103663] mb-6 flex items-center gap-2">
                    <FiCalendar className="h-5 w-5" />
                    Información del post
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiCalendar className="h-4 w-4" />
                        Fecha de publicación
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {formattedDate}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiTag className="h-4 w-4" />
                        Estado
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isAdminUser && (
            <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  <FiX className="h-4 w-4" />
                  Volver
                </button>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all duration-200 font-medium"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="h-4 w-4" />
                        Eliminar publicación
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
