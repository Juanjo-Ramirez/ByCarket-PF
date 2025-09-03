"use client";

import React from "react";

type OrderPostByProps = {
  onOrderChange: (order: "asc" | "desc") => void;
  currentOrder: "asc" | "desc";
};

const OrderPostBy = ({ onOrderChange, currentOrder }: OrderPostByProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-principal-blue text-sm font-medium">Ordenar por:</span>
      <div className="flex bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => onOrderChange("desc")}
          className={`px-3 py-1 text-sm rounded-l-lg ${currentOrder === "desc" ? "bg-secondary-blue text-white" : "text-gray-700"}`}
        >
          Más recientes
        </button>
        <button
          onClick={() => onOrderChange("asc")}
          className={`px-3 py-1 text-sm rounded-r-lg ${currentOrder === "asc" ? "bg-secondary-blue text-white" : "text-gray-700"}`}
        >
          Más antiguos
        </button>
      </div>
    </div>
  );
};

export default OrderPostBy;
