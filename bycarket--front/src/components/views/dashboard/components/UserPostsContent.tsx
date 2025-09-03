"use client";

import React from "react";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import PostList from "./admin/postslist/PostList";

const UserPostsContent = () => {
  const { canModeratePosts } = useRolePermissions();

  if (!canModeratePosts) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Acceso restringido
        </h2>
        <p className="text-gray-500 text-center">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-principal-blue">
            Administración de Posts
          </h2>
          <p className="text-gray-600 mt-1">
            Revisa y aprueba los posts pendientes de publicación
          </p>
        </div>
        <PostList />
      </div>
    </div>
  );
};

export default UserPostsContent;
