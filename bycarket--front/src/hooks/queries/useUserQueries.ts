"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserData,
  updateUserData,
  uploadUserProfileImage,
  deleteUserAccount,
  UserDataResponse,
  UpdateUserData,
} from "@/services/api.service";
import { queryKeys } from "@/lib/react-query";
import { useAuthStore } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { removeAuthToken } from "@/services/storage.service";

export function useUserQuery() {
  const { token, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.me,
    queryFn: getUserData,
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: (failureCount, error: any) => {
      // No reintentar si es error de auth
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => updateUserData(data),
    onSuccess: (updatedUser: UserDataResponse) => {
      // Actualizar cache inmediatamente
      queryClient.setQueryData(queryKeys.user.me, updatedUser);

      // Invalidar queries relacionadas para refetch si es necesario
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.me,
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
}

export function useUploadProfileImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadUserProfileImage(file),
    onSuccess: () => {
      // Invalidar user data para refetch con nueva imagen
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.me,
      });
    },
    onError: (error) => {
      console.error("Error uploading profile image:", error);
    },
  });
}

export function useDeleteAccountMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      // Limpiar todos los caches
      queryClient.clear();
      removeAuthToken();
      router.push("/login");
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
    },
  });
}

// Hook compuesto que combina todo lo necesario para userData
export function useOptimizedUserData() {
  const { data: userData, isLoading: loading, error, refetch } = useUserQuery();

  const updateUserMutation = useUpdateUserMutation();
  const uploadImageMutation = useUploadProfileImageMutation();
  const deleteAccountMutation = useDeleteAccountMutation();

  const updateUser = async (data: UpdateUserData) => {
    try {
      await updateUserMutation.mutateAsync(data);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al actualizar datos del usuario",
      };
    }
  };

  const uploadProfileImage = async (file: File) => {
    try {
      await uploadImageMutation.mutateAsync(file);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al subir la imagen de perfil",
      };
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al eliminar la cuenta",
      };
    }
  };

  return {
    userData,
    loading,
    error: error?.message || null,
    updating: updateUserMutation.isPending || uploadImageMutation.isPending,
    deleting: deleteAccountMutation.isPending,
    updateUser,
    uploadProfileImage,
    deleteAccount,
    refetch,
  };
}
