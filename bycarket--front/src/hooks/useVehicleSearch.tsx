"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  GetPostsResponse,
  PostResponse,
  getPosts,
} from "@/services/vehicle.service";

export interface UseVehicleSearchResult {
  isLoading: boolean;
  error: Error | null;
  posts: PostResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  refetch: () => Promise<void>;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useVehicleSearch = (): UseVehicleSearchResult => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GetPostsResponse | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const page = Number(searchParams.get("page")) || 1;
      const limit = 9;

      const filters: Record<string, any> = {
        brandId: searchParams.getAll("brandId"),
        modelId: searchParams.getAll("modelId"),
        versionId: searchParams.getAll("versionId"),
        typeOfVehicle: searchParams.getAll("typeOfVehicle"),
        condition: searchParams.get("condition"),
        currency: searchParams.get("currency"),
        search: searchParams.get("search"),
        minYear: searchParams.get("minYear"),
        maxYear: searchParams.get("maxYear"),
        minPrice: searchParams.get("minPrice"),
        maxPrice: searchParams.get("maxPrice"),
        minMileage: searchParams.get("minMileage"),
        maxMileage: searchParams.get("maxMileage"),
        orderBy: searchParams.get("orderBy"),
        order: searchParams.get("order"),
      };

      Object.keys(filters).forEach((key) => {
        if (
          !filters[key] ||
          (Array.isArray(filters[key]) && filters[key].length === 0)
        ) {
          delete filters[key];
        }
      });

      const response = await getPosts(page, limit, filters);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al obtener los vehículos")
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const currentPage = Number(searchParams.get("page")) || 1;

  return {
    isLoading,
    error,
    posts: data?.data || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.total || 0,
    currentPage,
    refetch: fetchPosts,
    hasNextPage: currentPage < (data?.totalPages || 0),
    hasPrevPage: currentPage > 1,
  };
};

export default useVehicleSearch;
