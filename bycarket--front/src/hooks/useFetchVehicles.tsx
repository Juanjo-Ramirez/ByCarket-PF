"use client";

import { useUserVehiclesQuery } from "@/hooks/queries/useVehicleQueries";

// Hook de compatibilidad que mantiene la misma interfaz
export const useFetchVehicles = () => {
  const {
    data: vehicles,
    isLoading: loading,
    refetch,
  } = useUserVehiclesQuery();

  return {
    vehicles: vehicles || [],
    loading,
    refetch,
  };
};
