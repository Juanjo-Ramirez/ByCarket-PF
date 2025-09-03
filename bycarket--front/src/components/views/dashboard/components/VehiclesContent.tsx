"use client";

import { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import MyVehicleLists from "./myvehicles/MyVehicleLists";
import MyVehicleDetails from "./myvehicles/MyVehicleDetails";
import { useRouter } from "next/navigation";
import {
  useUserVehiclesQuery,
  useDeleteVehicleMutation,
} from "@/hooks/queries/useVehicleQueries";
import { showSuccess, showError } from "@/app/utils/Notifications";
import { useSpinner } from "@/context/SpinnerContext";

export default function VehiclesContent() {
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: vehicles = [],
    isLoading: loading,
    refetch,
  } = useUserVehiclesQuery();
  const deleteVehicleMutation = useDeleteVehicleMutation();
  const router = useRouter();
  const { setLoading } = useSpinner();

  const handleViewDetails = (vehicle: VehicleResponse) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await deleteVehicleMutation.mutateAsync(id);
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(null);
        setIsModalOpen(false);
      }
      showSuccess("Vehículo eliminado correctamente");
      return true;
    } catch (error) {
      showError("Error al eliminar el vehículo. Inténtalo de nuevo.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVehicle = (updatedVehicle: VehicleResponse) => {
    showSuccess("Vehículo actualizado correctamente");
    setSelectedVehicle(updatedVehicle);
    setIsModalOpen(false);
    refetch();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVehicle(null), 300);
    refetch();
  };

  const handleAddVehicle = () => {
    router.push("/dashboard?tab=register-vehicle");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-principal-blue">
          Mis vehículos
        </h1>
        <button
          onClick={handleAddVehicle}
          className="px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-principal-blue/90 transition-colors"
        >
          Añadir vehículo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes vehículos registrados.</p>
          <button
            onClick={handleAddVehicle}
            className="mt-4 px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-principal-blue/90 transition-colors"
          >
            Añadir tu primer vehículo
          </button>
        </div>
      ) : (
        <>
          <MyVehicleLists
            vehicles={vehicles}
            loading={loading}
            onView={handleViewDetails}
            onDelete={handleDeleteVehicle}
          />
          {isModalOpen && selectedVehicle && (
            <MyVehicleDetails
              vehicle={selectedVehicle}
              onClose={handleModalClose}
              onUpdate={handleUpdateVehicle}
            />
          )}
        </>
      )}
    </div>
  );
}
