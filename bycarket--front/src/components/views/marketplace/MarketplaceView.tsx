"use client";

import { useState } from "react";
import { useVehicleSearch } from "@/hooks/useVehicleSearch";
import { Sidebar } from "./components/Sidebar";
import { MarketContainer } from "./components/MarketContainer";
import SearchBar from "@/components/ui/SearchBar";
import { useSearchParams } from "@/hooks/useSearchParams";

export default function MarketplaceView() {
  const { posts, isLoading, error, totalPages, currentPage, totalItems } =
    useVehicleSearch();
  const { setSearch } = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full min-h-screen bg-zinc-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 lg:mb-0">
            Marketplace
          </h1>
          <div className="w-full lg:w-96">
            <SearchBar onSearch={setSearch} />
          </div>
        </div>
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-principal-blue hover:text-principal-blue focus:outline-none focus:ring-2 focus:ring-principal-blue rounded"
          >
            <span>{showFilters ? "Cerrar filtros" : "Filtros"}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showFilters ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block rounded-md p-4 max-h-[80vh] overflow-auto lg:max-h-full lg:overflow-visible shadow-md`}
          >
            <Sidebar />
          </div>

          <div className="space-y-6 overflow-y-auto">
            <MarketContainer
              posts={posts}
              isLoading={isLoading}
              error={error}
              totalPages={totalPages}
              currentPage={currentPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
