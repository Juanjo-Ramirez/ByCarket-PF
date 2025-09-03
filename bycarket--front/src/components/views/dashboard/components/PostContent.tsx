"use client";

import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { getUserData } from "@/services/api.service";
import {
  showError,
  showSuccess,
  showPremiumRequired,
} from "@/app/utils/Notifications";
import { useSpinner } from "@/context/SpinnerContext";
import { PostResponse, VehicleResponse } from "@/services/vehicle.service";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { useFetchVehicles } from "@/hooks/useFetchVehicles";
import PostsList from "./posts/PostsList";
import PostsForm from "./posts/PostsForm";
import PostsDetail from "./posts/PostsDetail";

export default function PostContent() {
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showVehicleSelector, setShowVehicleSelector] =
    useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleResponse | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { setLoading: setGlobalLoading } = useSpinner();

  const {
    posts,
    loading: postsLoading,
    removePost: deletePost,
    createPost: createPostMutation,
    refreshPosts: refetchPosts,
  } = useFetchPosts(1, 100, {}, true);

  const {
    vehicles,
    loading: vehiclesLoading,
    refetch: refetchVehicles,
  } = useFetchVehicles();

  const { checkCanCreatePost, remainingPosts, isUser } = useRolePermissions();
  const { refetch: refetchUser } = useUserData();

  useEffect(() => {
    refetchPosts();
    refetchVehicles();
  }, []);

  const handleCreatePost = async (data: {
    vehicleId: string;
    description?: string;
    price?: number;
    isNegotiable: boolean;
  }) => {
    setIsCreating(true);
    setGlobalLoading(true);
    try {
      await createPostMutation(data);
      await Promise.all([refetchUser(), refetchPosts()]);
      showSuccess("Publicación creada exitosamente");
      setShowForm(false);
      setSelectedVehicle(null);
      setSelectedPost(null);
    } catch (error: any) {
      if (
        error?.response?.status === 403 ||
        (error?.response?.data?.message &&
          error.response.data.message.includes("upgrade to a premium"))
      ) {
        showPremiumRequired();
        setShowForm(false);
        setSelectedVehicle(null);
      } else {
        showError("Error inesperado al crear la publicación");
      }
    } finally {
      setGlobalLoading(false);
      setIsCreating(false);
    }
  };

  const handleDeletePost = async (postId: string): Promise<boolean> => {
    try {
      setGlobalLoading(true);
      await deletePost(postId);
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
      await refetchPosts();
      await refetchVehicles();
      showSuccess("Publicación eliminada correctamente");
      return true;
    } catch (error) {
      showError("Error al eliminar la publicación");
      return false;
    } finally {
      setGlobalLoading(false);
    }
  };

  const availableVehicles = vehicles.filter(
    (vehicle: any) => !posts.some((post: any) => post.vehicle.id === vehicle.id)
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-principal-blue">
            Mis Publicaciones
          </h2>
          {availableVehicles.length > 0 && (
            <div className="flex flex-col items-end gap-2">
              {isUser && remainingPosts > 0 && (
                <p className="text-sm text-gray-600">
                  Te quedan {remainingPosts} publicaciones gratuitas
                </p>
              )}
              <button
                onClick={() => setShowVehicleSelector(true)}
                disabled={remainingPosts === 0}
                className={`bg-principal-blue text-white px-4 py-2 rounded-lg hover:bg-principal-blue/90 transition-colors flex items-center gap-2 ${
                  remainingPosts === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Nueva Publicación
              </button>
            </div>
          )}
        </div>

        <div className="relative min-h-[300px]">
          {(postsLoading || vehiclesLoading) && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
            </div>
          )}
          <PostsList
            posts={posts}
            loading={false}
            onDelete={handleDeletePost}
            onView={setSelectedPost}
            emptyMessage={
              vehicles.length === 0
                ? "No tienes vehículos para publicar"
                : "Aún no tienes publicaciones"
            }
          />
        </div>
      </div>

      {showVehicleSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                Selecciona un vehículo para publicar
              </h3>
              <button
                onClick={() => setShowVehicleSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {vehiclesLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-principal-blue"></div>
                </div>
              ) : availableVehicles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tienes vehículos disponibles para publicar
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowVehicleSelector(false);
                        setShowForm(true);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <img
                            src={vehicle.images[0].secure_url}
                            alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">
                            {vehicle.brand.name} {vehicle.model.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {vehicle.version.name} {vehicle.year}
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            {vehicle.currency} {vehicle.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && selectedVehicle && (
        <PostsForm
          vehicle={selectedVehicle}
          onSubmit={handleCreatePost}
          onCancel={() => {
            setShowForm(false);
            setSelectedVehicle(null);
          }}
          loading={isCreating}
        />
      )}

      {selectedPost && (
        <PostsDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
}
