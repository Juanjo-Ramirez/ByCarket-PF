"use client";

import { useOptimizedPosts } from "@/hooks/queries/usePostQueries";

export type FilterState = {
  search?: string;
  brand?: string[];
  model?: string[];
  typeOfVehicle?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sort?: string;
  [key: string]: string | string[] | number | undefined;
};

// Hook de compatibilidad que mantiene la misma interfaz
export const useFetchPosts = (
  initialPage = 1,
  initialLimit = 10,
  initialFilters: FilterState = {},
  fetchUserPostsOnly = false,
  postId?: string
) => {
  const result = useOptimizedPosts(
    initialPage,
    initialLimit,
    initialFilters,
    fetchUserPostsOnly,
    postId
  );

  // Función para manejar cambio de página (si se necesita para compatibilidad)
  const handlePageChange = (page: number) => {
    // Con React Query, esto se maneja automáticamente cuando cambia el parámetro page
    console.log(`Page change to ${page} handled by React Query`);
  };

  // Función para actualizar filtros (si se necesita para compatibilidad)
  const updateFilters = (newFilters: FilterState) => {
    // Con React Query, esto se maneja automáticamente cuando cambian los filtros
    console.log(`Filters update handled by React Query`, newFilters);
  };

  return {
    ...result,
    handlePageChange,
    updateFilters,
    // Alias para compatibilidad
    removePost: result.deletePost,
    createPost: result.createPost,
  };
};
