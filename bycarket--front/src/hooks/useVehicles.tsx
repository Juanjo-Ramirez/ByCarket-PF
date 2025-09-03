"use client";

import { useEffect } from "react";
import useVehiclesStore from "@/context/VehiclesContext";
import { VehicleData } from "@/services/vehicle.service";

export const useVehicles = (fetchOnMount = true) => {
  const {
    vehicles,
    selectedVehicle,
    brands,
    models,
    versions,
    loading,
    error,
    pagination,
    filters,
    fetchVehicles,
    fetchUserVehicles,
    fetchVehicleById,
    createNewVehicle,
    removeVehicle,
    setSelectedVehicle,
    fetchBrands,
    fetchModels,
    fetchVersions,
    setFilters,
    resetFilters,
    resetState,
  } = useVehiclesStore();

  useEffect(() => {
    if (fetchOnMount) {
      fetchUserVehicles();
    }
  }, [fetchOnMount, fetchUserVehicles]);

  const loadVehicleDetails = async (id: string) => {
    return await fetchVehicleById(id);
  };

  const createVehicle = async (data: VehicleData) => {
    return await createNewVehicle(data);
  };

  const deleteVehicle = async (id: string) => {
    return await removeVehicle(id);
  };

  const loadBrandsData = async () => {
    await fetchBrands();
  };

  const loadModelsData = async (brandId?: string) => {
    await fetchModels(brandId);
  };

  const loadVersionsData = async (modelId?: string) => {
    await fetchVersions(modelId);
  };

  const loadVehiclesWithPagination = async (page = 1, limit = 10) => {
    await fetchVehicles(page, limit);
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
  };

  return {
    vehicles,
    selectedVehicle,
    brands,
    models,
    versions,
    loading,
    error,
    pagination,
    filters,
    loadVehicleDetails,
    createVehicle,
    deleteVehicle,
    setSelectedVehicle,
    loadBrandsData,
    loadModelsData,
    loadVersionsData,
    loadVehiclesWithPagination,
    updateFilters,
    resetFilters,
    resetState,
    refetch: fetchUserVehicles,
  };
};

export default useVehicles;
