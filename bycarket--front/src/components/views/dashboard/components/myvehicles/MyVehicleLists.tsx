"use client";

import { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import MyVehicleCard from "./MyVehicleCard";
import { useSpinner } from "@/context/SpinnerContext";

interface MyVehicleListsProps {
  vehicles: VehicleResponse[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (vehicle: VehicleResponse) => void;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export default function MyVehicleLists({
  vehicles,
  loading = false,
  onDelete,
  onView,
  emptyMessage = "No tienes vehículos registrados",
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
}: MyVehicleListsProps) {
  const [sortBy, setSortBy] = useState<string>("newest");
  const { loading: spinnerLoading } = useSpinner();

  if (loading || spinnerLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        <p className="mt-4 text-secondary-blue font-medium">
          Cargando vehículos...
        </p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-secondary-blue/50 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <p className="text-gray-500 text-center max-w-md">{emptyMessage}</p>
      </div>
    );
  }

  const sortedVehicles = [...vehicles].sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "year-new":
        return b.year - a.year;
      case "year-old":
        return a.year - b.year;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="text-sm text-gray-500">
          Mostrando {vehicles.length} vehículos
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-principal-blue focus:border-principal-blue"
        >
          <option value="price-high">Mayor precio</option>
          <option value="price-low">Menor precio</option>
          <option value="year-new">Año (más nuevo)</option>
          <option value="year-old">Año (más antiguo)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVehicles.map((vehicle) => (
          <MyVehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() =>
                onPageChange && onPageChange(Math.max(1, currentPage - 1))
              }
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                onPageChange &&
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 10, totalItems)}
                </span>{" "}
                de <span className="font-medium">{totalItems}</span> resultados
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    onPageChange && onPageChange(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange && onPageChange(pageNum)}
                      aria-current={
                        currentPage === pageNum ? "page" : undefined
                      }
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === pageNum
                          ? "z-10 bg-principal-blue text-white focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-principal-blue"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    onPageChange &&
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
