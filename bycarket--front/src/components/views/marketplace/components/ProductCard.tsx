"use client";

import { PostResponse } from "@/services/vehicle.service";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  post: PostResponse;
}

export function ProductCard({ post }: ProductCardProps) {
  const formatCurrency = (price: number, currency: string) => {
    if (currency === "U$D") {
      return `U$D ${price.toLocaleString()}`;
    }
    return `AR$ ${price.toLocaleString()}`;
  };

  return (
    <Link
      href={`/marketplace/${post.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-zinc-100 flex flex-col h-full hover:border-secondary-blue/30"
    >
      <div className="relative h-48 w-full bg-gray-50">
        {post.vehicle.images && post.vehicle.images.length > 0 ? (
          <Image
            src={post.vehicle.images[0].secure_url}
            alt={`${post.vehicle.brand.name} ${post.vehicle.model.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-principal-blue/10 text-principal-blue">
            {post.vehicle.condition === "new" ? "Nuevo" : "Usado"}
          </span>
          <span className="inline-block px-2 py-1 ml-2 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {post.vehicle.typeOfVehicle}
          </span>
          {post.isNegotiable && (
            <span className="inline-block px-2 py-1 ml-2 text-xs font-medium rounded-full bg-green-100 text-green-700">
              Negociable
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-1 text-gray-800">
          {post.vehicle.brand.name} {post.vehicle.model.name}
        </h3>

        <p className="text-sm text-gray-600 mb-2">
          {post.vehicle.version.name} - {post.vehicle.year}
        </p>

        <div className="mt-auto pt-3">
          <p className="text-xl font-bold text-principal-blue">
            {formatCurrency(post.vehicle.price, post.vehicle.currency)}
          </p>

          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>{post.vehicle.mileage.toLocaleString()} km</span>
            <span>{new Date(post.postDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
