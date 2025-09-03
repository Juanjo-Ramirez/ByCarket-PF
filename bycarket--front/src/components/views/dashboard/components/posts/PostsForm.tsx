"use client";

import { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import { generateVehicleDescription } from "@/services/vehicle.service";
import GenerateAIButton from "@/components/ui/GenerateAIButton";
import {
  showError,
  showSuccess,
  showPremiumRequired,
} from "@/app/utils/Notifications";
import { useSpinner } from "@/context/SpinnerContext";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface PostsFormProps {
  vehicle: VehicleResponse;
  onSubmit: (data: {
    vehicleId: string;
    description?: string;
    price?: number;
    isNegotiable: boolean;
  }) => Promise<"PREMIUM_REQUIRED" | void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PostsForm({
  vehicle,
  onSubmit,
  onCancel,
  loading = false,
}: PostsFormProps) {
  const [description, setDescription] = useState<string>(
    vehicle.description || ""
  );
  const [price, setPrice] = useState<number | null>(vehicle.price);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { setLoading } = useSpinner();
  const { checkCanCreatePost, canCreatePost, remainingPosts } =
    useRolePermissions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!price || price <= 0) {
      showError("El precio es requerido y debe ser mayor a 0");
      return;
    }

    setLoading(true);

    try {
      const canCreate = await checkCanCreatePost();
      if (!canCreate) {
        showPremiumRequired();
        return;
      }

      const result = await onSubmit({
        vehicleId: vehicle.id,
        description: description || undefined,
        price: price || undefined,
        isNegotiable,
      });

      if (result === "PREMIUM_REQUIRED") {
        showPremiumRequired();
      } 
    } catch (error: any) {
      if (error?.response?.status === 403) {
        showPremiumRequired();
      } else if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError(
          "Error al publicar el vehículo. Por favor, intente nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!description.trim()) {
      showError("La descripción está vacía");
      return;
    }

    setIsGenerating(true);
    setLoading(true);
    try {
      const generatedDesc = await generateVehicleDescription(description);
      setDescription(generatedDesc);
      showSuccess("Descripción mejorada con éxito");
    } catch (error) {
      showError("Error al generar la descripción");
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-principal-blue">
            Publicar vehículo
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-principal-blue/5 p-4 rounded-xl">
            <h3 className="font-medium text-principal-blue mb-4">
              Detalles del vehículo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {vehicle.images && vehicle.images.length > 0 ? (
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img
                      src={vehicle.images[0].secure_url}
                      alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Sin imagen</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-lg text-principal-blue mb-2">
                  {vehicle.brand.name} {vehicle.model.name}
                </h4>

                {vehicle.version && (
                  <p className="text-gray-600 mb-2">{vehicle.version.name}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {vehicle.year && (
                    <span className="bg-principal-blue/10 text-principal-blue px-2 py-1 rounded text-sm">
                      {vehicle.year}
                    </span>
                  )}
                  {vehicle.condition && (
                    <span className="bg-principal-blue/10 text-principal-blue px-2 py-1 rounded text-sm">
                      {vehicle.condition}
                    </span>
                  )}
                </div>

                <p className="font-bold text-xl mb-2 text-principal-blue">
                  ${vehicle.price?.toLocaleString()}
                </p>

                <p className="text-gray-600 text-sm">
                  {vehicle.mileage?.toLocaleString()} km
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-principal-blue font-medium mb-2"
                >
                  Precio
                </label>
                <input
                  type="number"
                  id="price"
                  value={price ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPrice(value ? Number(value) : null);
                  }}
                  required
                  min="1"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-principal-blue focus:border-principal-blue ${
                    !price ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Ingresa el precio"
                />
              </div>

              <div>
                <div className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    id="isNegotiable"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="w-4 h-4 text-principal-blue border-gray-300 rounded focus:ring-principal-blue"
                  />
                  <label htmlFor="isNegotiable" className="ml-2 text-gray-700">
                    Precio negociable
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="description"
                  className="block text-principal-blue font-medium"
                >
                  Descripción (opcional)
                </label>
                <GenerateAIButton
                  onClick={handleGenerateDescription}
                  isGenerating={isGenerating}
                  disabled={loading}
                />
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal-blue focus:border-principal-blue min-h-[120px]"
                placeholder="Añade una descripción personalizada para esta publicación"
              />
              <p className="text-gray-500 text-sm mt-1">
                Puedes dejar este campo vacío para usar la descripción original
                del vehículo.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className={`rounded-lg p-4 text-sm ${
                  remainingPosts > 0
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-yellow-50 border border-yellow-200 text-yellow-800"
                }`}
              >
                <p
                  className={`text-sm ${
                    remainingPosts > 0 ? "text-green-800" : "text-yellow-800"
                  }`}
                >
                  {remainingPosts > 0
                    ? `Tienes ${remainingPosts} publicaciones disponibles`
                    : "No tienes publicaciones disponibles"}
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !canCreatePost}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    loading || !canCreatePost
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-principal-blue hover:bg-principal-blue/90"
                  }`}
                >
                  {loading ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
