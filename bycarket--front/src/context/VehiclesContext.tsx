"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  VehicleResponse,
  VehicleData,
  Brand,
  Model,
  Version,
  GetVehiclesResponse,
  getBrands,
  getModels,
  getVersions,
  getModelsByBrand,
  getVersionsByModel,
  createVehicle,
  getVehicles,
  getUserVehicles,
  getVehicleById,
  deleteVehicle,
} from "@/services/vehicle.service";

interface VehiclesState {
  vehicles: VehicleResponse[];
  selectedVehicle: VehicleResponse | null;
  brands: Brand[];
  models: Model[];
  versions: Version[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
  filters: {
    brandId?: string;
    modelId?: string;
    yearFrom?: number;
    yearTo?: number;
    priceFrom?: number;
    priceTo?: number;
    condition?: string;
  };
}

interface VehiclesActions {
  fetchVehicles: (page?: number, limit?: number) => Promise<void>;
  fetchUserVehicles: () => Promise<void>;
  fetchVehicleById: (id: string) => Promise<VehicleResponse | null>;
  createNewVehicle: (data: VehicleData) => Promise<VehicleResponse | null>;
  removeVehicle: (id: string) => Promise<boolean>;
  updateVehicleInState: (updatedVehicle: VehicleResponse) => void;
  setSelectedVehicle: (vehicle: VehicleResponse | null) => void;
  fetchBrands: () => Promise<void>;
  fetchModels: (brandId?: string) => Promise<void>;
  fetchVersions: (modelId?: string) => Promise<void>;
  setFilters: (filters: Partial<VehiclesState["filters"]>) => void;
  resetFilters: () => void;
  resetState: () => void;
}

const initialState: VehiclesState = {
  vehicles: [],
  selectedVehicle: null,
  brands: [],
  models: [],
  versions: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },
  filters: {},
};

export const useVehiclesStore = create<VehiclesState & VehiclesActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchVehicles: async (page = 1, limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await getVehicles(page, limit);
          set({
            vehicles: response.vehicles,
            pagination: {
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              totalItems: response.totalItems,
              limit,
            },
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar vehículos",
          });
        }
      },

      fetchUserVehicles: async () => {
        try {
          set({ loading: true, error: null });
          const vehicles = await getUserVehicles();
          set({ vehicles, loading: false });
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar tus vehículos",
          });
        }
      },

      fetchVehicleById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const vehicle = await getVehicleById(id);
          set({ selectedVehicle: vehicle, loading: false });
          return vehicle;
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar el vehículo",
          });
          return null;
        }
      },

      createNewVehicle: async (data: VehicleData) => {
        try {
          set({ loading: true, error: null });
          const newVehicle = await createVehicle(data);
          set((state) => ({
            vehicles: [...state.vehicles, newVehicle],
            loading: false,
          }));
          return newVehicle;
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al crear el vehículo",
          });
          return null;
        }
      },

      removeVehicle: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await deleteVehicle(id);
          set((state) => ({
            vehicles: state.vehicles.filter((v) => v.id !== id),
            loading: false,
          }));
          return true;
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al eliminar el vehículo",
          });
          return false;
        }
      },

      setSelectedVehicle: (vehicle) => {
        set({ selectedVehicle: vehicle });
      },

      updateVehicleInState: (updatedVehicle) => {
        set((state) => ({
          vehicles: state.vehicles.map((v) =>
            v.id === updatedVehicle.id ? updatedVehicle : v
          ),
          selectedVehicle:
            state.selectedVehicle?.id === updatedVehicle.id
              ? updatedVehicle
              : state.selectedVehicle,
        }));
      },

      fetchBrands: async () => {
        try {
          set({ loading: true, error: null });
          const brands = await getBrands();
          set({ brands, loading: false });
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error ? error.message : "Error al cargar marcas",
          });
        }
      },

      fetchModels: async (brandId) => {
        try {
          set({ loading: true, error: null });
          const models = brandId
            ? await getModelsByBrand(brandId)
            : await getModels();
          set({ models, loading: false });
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar modelos",
          });
        }
      },

      fetchVersions: async (modelId) => {
        try {
          set({ loading: true, error: null });
          const versions = modelId
            ? await getVersionsByModel(modelId)
            : await getVersions();
          set({ versions, loading: false });
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar versiones",
          });
        }
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: {} });
      },

      resetState: () => {
        set(initialState);
      },
    }),
    { name: "vehicles-store" }
  )
);

export default useVehiclesStore;
