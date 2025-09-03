"use client";

import { useState } from "react";
import { FiEye, FiTrash2, FiTruck, FiCheckCircle, FiTag } from "react-icons/fi";
import { VehicleResponse } from "@/services/vehicle.service";

interface MyVehicleCardProps {
  vehicle: VehicleResponse;
  onView?: (vehicle: VehicleResponse) => void;
  onDelete?: (id: string) => Promise<boolean>;
}

export default function MyVehicleCard({ vehicle, onView }: MyVehicleCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onView) onView(vehicle);
  };

  const mainImage =
    vehicle.images && vehicle.images.length > 0 && !imageError
      ? vehicle.images[0].secure_url
      : "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop";

  const vehicleName = `${vehicle.brand.name} ${vehicle.model.name}`;

  const getConditionConfig = (condition: string) => {
    if (condition === "Nuevo" || condition === "New") {
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: FiCheckCircle,
        label: "Nuevo",
      };
    }
    return {
      bg: "bg-blue-50",
      text: "text-principal-blue",
      border: "border-blue-200",
      icon: FiTag,
      label: "Usado",
    };
  };

  const conditionConfig = getConditionConfig(vehicle.condition);
  const ConditionIcon = conditionConfig.icon;

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleView}
    >
      <div className="relative">
        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <img
            src={mainImage}
            alt={vehicleName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm bg-gray-100 text-principal-blue border-slate-200">
            <FiTruck className="w-3 h-3" />
            {vehicle.typeOfVehicle}
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm bg-white/90 ${conditionConfig.bg} ${conditionConfig.text} ${conditionConfig.border}`}
          >
            <ConditionIcon className="w-3 h-3" />
            {conditionConfig.label}
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleView}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Ver detalles"
          >
            <FiEye className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-[#103663] transition-colors duration-300">
            {vehicleName}
          </h3>

          <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {vehicle.year}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {vehicle.mileage.toLocaleString()} km
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {vehicle.condition === "Used"
                ? "Usado"
                : vehicle.condition === "New"
                ? "Nuevo"
                : vehicle.condition}
            </span>
          </div>

          <div className="text-2xl font-bold text-[#103663] mb-1">
            {vehicle.currency} {vehicle.price.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleView}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white text-sm font-medium rounded-xl hover:from-[#0d2a4f] hover:to-[#3d6291] transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}
