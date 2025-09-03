"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserVehicles,
  getVehicles,
  getVehicleById,
  createVehicle,
  deleteVehicle,
  updateVehicle,
  getBrands,
  getModelsByBrand,
  getVersionsByModel,
  VehicleData,
  VehicleResponse,
  Brand,
  Model,
  Version,
} from "@/services/vehicle.service";
import { queryKeys } from "@/lib/react-query";
import { useAuthStore } from "@/context/AuthContext";

// Vehicles queries
export function useUserVehiclesQuery() {
  const { token, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.vehicles.me,
    queryFn: getUserVehicles,
    enabled: !!token && isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutos para vehicles
    gcTime: 5 * 60 * 1000,
  });
}

export function useVehiclesQuery(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.vehicles.list(page, limit),
    queryFn: () => getVehicles(page, limit),
    staleTime: 1 * 60 * 1000, // 1 minuto para lista general
    gcTime: 3 * 60 * 1000,
  });
}

export function useVehicleQuery(vehicleId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.vehicles.detail(vehicleId),
    queryFn: () => getVehicleById(vehicleId),
    enabled: !!vehicleId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Vehicle reference data queries (brands, models, versions)
export function useBrandsQuery() {
  return useQuery({
    queryKey: queryKeys.vehicles.brands,
    queryFn: getBrands,
    staleTime: 30 * 60 * 1000, // 30 minutos - datos estáticos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}

export function useModelsQuery(brandId?: string) {
  return useQuery({
    queryKey: queryKeys.vehicles.models(brandId),
    queryFn: () => (brandId ? getModelsByBrand(brandId) : Promise.resolve([])),
    enabled: !!brandId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useVersionsQuery(modelId?: string) {
  return useQuery({
    queryKey: queryKeys.vehicles.versions(modelId),
    queryFn: () =>
      modelId ? getVersionsByModel(modelId) : Promise.resolve([]),
    enabled: !!modelId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

// Vehicle mutations
export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleData) => createVehicle(data),
    onSuccess: (newVehicle: VehicleResponse) => {
      // Invalidar lista de vehículos del usuario
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.me,
      });

      // Invalidar listas generales
      queryClient.invalidateQueries({
        queryKey: ["vehicles", "list"],
        exact: false,
      });

      // Agregar a cache el nuevo vehículo
      queryClient.setQueryData(
        queryKeys.vehicles.detail(newVehicle.id),
        newVehicle
      );
    },
  });
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => deleteVehicle(vehicleId),
    onSuccess: (_, vehicleId) => {
      // Remover del cache individual
      queryClient.removeQueries({
        queryKey: queryKeys.vehicles.detail(vehicleId),
      });

      // Invalidar listas
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.me,
      });

      queryClient.invalidateQueries({
        queryKey: ["vehicles", "list"],
        exact: false,
      });
    },
  });
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      data,
    }: {
      vehicleId: string;
      data: Partial<VehicleData>;
    }) => updateVehicle(vehicleId, data),
    onSuccess: (updatedVehicle: VehicleResponse) => {
      // Actualizar cache individual
      queryClient.setQueryData(
        queryKeys.vehicles.detail(updatedVehicle.id),
        updatedVehicle
      );

      // Invalidar listas para refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.me,
      });
    },
  });
}

// Hook compuesto para formulario de vehículos
export function useVehicleFormQueries() {
  const brandsQuery = useBrandsQuery();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const modelsQuery = useModelsQuery(selectedBrandId);
  const versionsQuery = useVersionsQuery(selectedModelId);

  const createMutation = useCreateVehicleMutation();

  return {
    // Data
    brands: brandsQuery.data || [],
    models: modelsQuery.data || [],
    versions: versionsQuery.data || [],

    // Loading states
    loadingBrands: brandsQuery.isLoading,
    loadingModels: modelsQuery.isLoading,
    loadingVersions: versionsQuery.isLoading,

    // Selection handlers
    selectedBrandId,
    selectedModelId,
    setSelectedBrandId,
    setSelectedModelId,

    // Mutations
    createVehicle: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
}
