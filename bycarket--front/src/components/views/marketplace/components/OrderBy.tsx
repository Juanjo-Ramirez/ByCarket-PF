"use client";

import { useSearchParams } from "@/hooks/useSearchParams";
import { FiChevronDown } from "react-icons/fi";

type OrderOption = {
  label: string;
  value: string;
  direction?: "ASC" | "DESC";
};

export function OrderBy() {
  const { params, setSorting } = useSearchParams();

  const orderOptions: OrderOption[] = [
    { label: "Más recientes", value: "posts.postDate", direction: "DESC" },
    { label: "Más antiguos", value: "posts.postDate", direction: "ASC" },
    {
      label: "Precio: menor a mayor",
      value: "vehicle.price",
      direction: "ASC",
    },
    {
      label: "Precio: mayor a menor",
      value: "vehicle.price",
      direction: "DESC",
    },
    { label: "Año: más nuevos", value: "vehicle.year", direction: "DESC" },
    { label: "Año: más antiguos", value: "vehicle.year", direction: "ASC" },
    {
      label: "Kilometraje: menor a mayor",
      value: "vehicle.mileage",
      direction: "ASC",
    },
    {
      label: "Kilometraje: mayor a menor",
      value: "vehicle.mileage",
      direction: "DESC",
    },
  ];

  const currentValue =
    params.orderBy && params.order
      ? `${params.orderBy}-${params.order}`
      : `posts.postDate-DESC`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [orderBy, order] = e.target.value.split("-") as [
      string,
      "ASC" | "DESC"
    ];
    setSorting(orderBy as any, order);
  };

  return (
    <div className="relative">
      <select
        value={currentValue}
        onChange={handleChange}
        className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-principal-blue/20 focus:border-principal-blue transition-all duration-200 cursor-pointer"
      >
        {orderOptions.map((option) => (
          <option
            key={`${option.value}-${option.direction}`}
            value={`${option.value}-${option.direction}`}
            className="text-gray-700"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <FiChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
