"use client";

import { PostResponse } from "@/services/vehicle.service";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard } from "./ProductCard";
import Pagination from "./pagination";

interface MarketContainerProps {
  posts: PostResponse[];
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export function MarketContainer({
  posts,
  isLoading,
  error,
  totalPages,
  currentPage,
  totalItems,
}: MarketContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-600">Cargando vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-red-50 rounded-xl border border-red-100 p-8">
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error al cargar los vehículos
        </h3>
        <p className="text-red-600 text-center">{error.message}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-blue-50 rounded-xl border border-blue-100 p-8">
        <svg
          className="w-12 h-12 text-blue-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          No se encontraron vehículos
        </h3>
        <p className="text-blue-600 text-center">
          Intenta ajustar los filtros para ver más resultados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-700">
          {totalItems}{" "}
          {totalItems === 1 ? "vehículo encontrado" : "vehículos encontrados"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ProductCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
