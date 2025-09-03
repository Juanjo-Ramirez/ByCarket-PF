"use client";

import { useState } from "react";
import { PostResponse } from "@/services/vehicle.service";
import PostsCard from "./PostsCard";
import { useSpinner } from "@/context/SpinnerContext";
import { showError, showSuccess } from "@/app/utils/Notifications";

interface PostsListProps {
  posts: PostResponse[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (post: PostResponse) => void;
  emptyMessage?: string;
}

export default function PostsList({
  posts,
  loading = false,
  onDelete,
  onView,
  emptyMessage = "No hay publicaciones disponibles",
}: PostsListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { setLoading } = useSpinner();

  const handleDelete = async (id: string): Promise<boolean> => {
    if (!onDelete) return false;

    setDeletingId(id);
    setLoading(true);
    try {
      const success = await onDelete(id);
    
      return success;
    } catch (error) {
      showError("Error al eliminar la publicación");
      console.error("Error deleting post:", error);
      return false;
    } finally {
      setDeletingId(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        <p className="mt-4 text-secondary-blue font-medium">
          Cargando publicaciones...
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p className="text-gray-500 text-center max-w-md">{emptyMessage}</p>
      </div>
    );
  }

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    return post.status.toLowerCase() === filter.toLowerCase();
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
      case "oldest":
        return new Date(a.postDate).getTime() - new Date(b.postDate).getTime();
      case "price-high":
        return b.vehicle.price - a.vehicle.price;
      case "price-low":
        return a.vehicle.price - b.vehicle.price;
      case "year-new":
        return b.vehicle.year - a.vehicle.year;
      case "year-old":
        return a.vehicle.year - b.vehicle.year;
      default:
        return 0;
    }
  });

  const statusCounts = posts.reduce((acc, post) => {
    const status = post.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusOptions = [
    {
      value: "all",
      label: `Todos (${posts.length})`,
      color: "bg-gray-100 text-gray-800",
      dot: "bg-gray-500",
    },
    {
      value: "active",
      label: `Activo (${statusCounts["active"] || 0})`,
      color: "bg-green-100 text-green-800",
      dot: "bg-green-500",
    },
    {
      value: "inactive",
      label: `Inactivo (${statusCounts["inactive"] || 0})`,
      color: "bg-gray-100 text-gray-800",
      dot: "bg-gray-500",
    },
    {
      value: "pending",
      label: `Pendiente (${statusCounts["pending"] || 0})`,
      color: "bg-yellow-300 text-yellow-800",
      dot: "bg-yellow-300",
    },
    {
      value: "rejected",
      label: `Rechazado (${statusCounts["rejected"] || 0})`,
      color: "bg-red-100 text-red-800",
      dot: "bg-red-500",
    },
  ].filter(
    (option) => option.value === "all" || statusCounts[option.value] > 0
  );

  const sortOptions = [
    { value: "newest", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "price-high", label: "Mayor precio" },
    { value: "price-low", label: "Menor precio" },
    { value: "year-new", label: "Año (más nuevo)" },
    { value: "year-old", label: "Año (más antiguo)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center transition-all border ${
                filter === option.value
                  ? `${option.color} border-secondary-blue`
                  : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"
              }`}
            >
              <span
                className={`w-2 h-2 ${option.dot} rounded-full mr-2`}
              ></span>
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-principal-blue focus:border-principal-blue"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="w-full py-8 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500">
            No hay publicaciones con el filtro seleccionado
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <PostsCard
              key={post.id}
              post={post}
              onDelete={() => handleDelete(post.id)}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
