"use client";

import React from "react";

type StatusFilterPostProps = {
  currentStatus: string;
  onStatusChange: (status: string) => void;
};

const statusOptions = [
  { value: "PENDING", label: "Pendiente", color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
  { value: "ACTIVE", label: "Activo", color: "bg-green-100 text-green-800", dot: "bg-green-500" },
  { value: "INACTIVE", label: "Inactivo", color: "bg-gray-100 text-gray-800", dot: "bg-gray-500" },
];

const StatusFilterPost = ({ currentStatus, onStatusChange }: StatusFilterPostProps) => {
  return (
    <div className="flex items-center gap-2">
      {statusOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center transition-all border border-transparent ${
            currentStatus === option.value
              ? `${option.color} border-secondary-blue`
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
          onClick={() => onStatusChange(option.value)}
        >
          <span className={`w-2 h-2 ${option.dot} rounded-full mr-2`}></span>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilterPost;
