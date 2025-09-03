"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";

type PostCardProps = {
  post: PostResponse;
  onViewDetail: (post: PostResponse) => void;
};

const PostCard = ({ post, onViewDetail }: PostCardProps) => {
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(post.postDate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const vehicleImage =
    post.vehicle.images?.length > 0 && !imageError
      ? post.vehicle.images[0].secure_url
      : "https://images.unsplash.com/photo-1494976688153-c14fd6dc2c32?w=400&h=300&fit=crop";

  const vehicleName = `${post.vehicle.brand.name} ${post.vehicle.model.name} ${
    post.vehicle.version?.name || ""
  }`.trim();

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-500 transform hover:-translate-y-1">
      <div className="relative">
        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <Image
            src={vehicleImage}
            alt={vehicleName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="absolute top-4 left-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm bg-blue-50 text-blue-700 border-blue-200">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            {formattedDate}
          </div>
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
              {post.vehicle.year}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {post.vehicle.mileage.toLocaleString()} km
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {post.vehicle.condition}
            </span>
          </div>

          <div className="text-2xl font-bold text-[#103663] mb-1">
            {post.vehicle.currency} {post.vehicle.price.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={() => onViewDetail(post)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white text-sm font-medium rounded-xl hover:from-[#0d2a4f] hover:to-[#3d6291] transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
