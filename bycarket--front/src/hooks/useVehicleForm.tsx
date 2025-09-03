import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getBrands,
  getModelsByBrand as fetchModelsByBrand,
  getVersionsByModel as fetchVersionsByModel,
  createVehicle,
  Brand,
  Model,
  Version,
  VehicleData,
  uploadVehicleImages,
} from "@/services/vehicle.service";

export const useVehicleForm = () => {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<Version[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        setError("Error al cargar las marcas");
      }
    };

    fetchBrands();
  }, []);

  const handleBrandChange = (brandId: string, models: Model[] = []) => {
    setSelectedBrand(brandId);
    setSelectedModel("");
    setFilteredModels(models);
    setFilteredVersions([]);
  };

  const handleModelChange = (modelId: string, versions: Version[] = []) => {
    setSelectedModel(modelId);
    setFilteredVersions(versions);
  };

  const getModelsByBrand = async (brandId: string) => {
    try {
      const models = await fetchModelsByBrand(brandId);
      setFilteredModels(models);
    } catch (err) {
      setError("Error al cargar los modelos");
    }
  };

  const getVersionsByModel = async (modelId: string) => {
    try {
      const versions = await fetchVersionsByModel(modelId);
      setFilteredVersions(versions);
    } catch (err) {
      setError("Error al cargar las versiones");
    }
  };

  const submitVehicle = async (vehicleData: VehicleData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createVehicle(vehicleData);
      setSuccess(true);
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al crear el vehículo";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    models: filteredModels,
    versions: filteredVersions,
    loading,
    error,
    success,
    selectedBrand,
    selectedModel,
    getModelsByBrand,
    getVersionsByModel,
    handleBrandChange,
    handleModelChange,
    submitVehicle,
  };
};
