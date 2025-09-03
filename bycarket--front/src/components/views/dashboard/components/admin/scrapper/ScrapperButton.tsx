import React, { useState } from "react";
import { FiPlay } from "react-icons/fi";
import { getScrapperData } from "@/services/api.service";
import { showSuccess, showError } from "@/app/utils/Notifications";

export default function ScrapperButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleScraping = async () => {
    try {
      setIsLoading(true);
      const response = await getScrapperData();
      if (response) {
        showSuccess("Scraping completado exitosamente");
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al realizar el scraping:", error);
      showError(
        "Error al realizar el scraping. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <button
            onClick={handleScraping}
            disabled={isLoading}
            className={`w-full max-w-md group relative overflow-hidden bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#103663]/25 hover:scale-[1.02] active:scale-[0.98] ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative flex items-center justify-center gap-2 sm:gap-3">
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiPlay className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="text-base sm:text-lg">
                {isLoading ? "Procesando..." : "Iniciar Scraping"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
