"use client";

import React from "react";

interface StatusFilterTabsProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const StatusFilterTabs = ({
  activeFilter,
  onFilterChange,
}: StatusFilterTabsProps) => {
  const filters = [
    { id: "all", label: "Todos" },
    { id: "active", label: "Activos" },
    { id: "inactive", label: "Inactivos" },
  ];

  const getVariant = (filterId: string) => {
    if (filterId === "active") return "bg-green-100 text-green-800";
    if (filterId === "inactive") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getOptionStyle = (id: string) => {
    if (id === "active") {
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        dotColor: "bg-green-500"
      };
    }
    if (id === "inactive") {
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        dotColor: "bg-gray-500"
      };
    }
    return {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      dotColor: "bg-blue-500"
    };
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {filters.map((filter) => {
        const { bgColor, textColor, dotColor } = getOptionStyle(filter.id);
        const isActive = activeFilter === (filter.id === "all" ? null : filter.id);
        
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id === "all" ? null : filter.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center transition-all border ${
              isActive 
                ? `${bgColor} ${textColor} border-secondary-blue`
                : "bg-white text-gray-500 hover:bg-gray-50 border-transparent"
            }`}
          >
            <span className={`w-2 h-2 ${dotColor} rounded-full mr-2`}></span>
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilterTabs;
