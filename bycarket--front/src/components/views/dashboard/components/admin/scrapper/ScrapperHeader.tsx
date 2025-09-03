import React from "react";
import { FiDatabase } from "react-icons/fi";

export default function ScrapperHeader() {
  return (
    <header className="w-full py-4 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#103663] to-[#4a77a8]">
            <FiDatabase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#103663]">
              Web Scrapper
            </h1>
            <p className="text-xs sm:text-sm text-[#4a77a8] font-medium">
              Panel de Administración
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
