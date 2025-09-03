"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  deletePost,
  acceptPost,
  rejectPost,
  getPendingPosts,
  PostResponse,
  GetPostsResponse,
} from "@/services/vehicle.service";
import { queryKeys } from "@/lib/react-query";
import { useOptimizedUserData } from "./useUserQueries";
import { useAuthStore } from "@/context/AuthContext";

// Posts queries
export function usePostsQuery(
  page: number = 1,
  limit: number = 9,
  filters: any = {}
) {
  return useQuery({
    queryKey: queryKeys.posts.list(page, limit, filters),
    queryFn: () => getPosts(page, limit, filters),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Reemplaza keepPreviousData
  });
}

export function useMyPostsQuery() {
  const { token, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.posts.me,
    queryFn: getMyPosts,
    enabled: !!token && isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000,
  });
}

export function usePostQuery(postId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: () => getPostById(postId),
    enabled: !!postId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePendingPostsQuery(page: number = 1, limit: number = 10) {
  const { userData } = useOptimizedUserData();
  const isAdmin = userData?.role === "admin";

  return useQuery({
    queryKey: queryKeys.posts.pending(page, limit),
    queryFn: () => getPendingPosts({ page, limit }),
    enabled: isAdmin,
    staleTime: 30 * 1000, // 30 segundos para posts pendientes
    gcTime: 2 * 60 * 1000,
  });
}

// Post mutations
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      vehicleId: string;
      description?: string;
      price?: number;
      isNegotiable: boolean;
    }) => createPost(data),
    onSuccess: (newPost: PostResponse) => {
      // Invalidar mis posts
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.me,
      });

      // Invalidar listas de posts
      queryClient.invalidateQueries({
        queryKey: ["posts", "list"],
        exact: false,
      });

      // Agregar a cache individual
      queryClient.setQueryData(queryKeys.posts.detail(newPost.id), newPost);

      // Si es admin, invalidar posts pendientes
      queryClient.invalidateQueries({
        queryKey: ["posts", "pending"],
        exact: false,
      });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (_, postId) => {
      // Remover del cache individual
      queryClient.removeQueries({
        queryKey: queryKeys.posts.detail(postId),
      });

      // Invalidar listas
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.me,
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "list"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "pending"],
        exact: false,
      });
    },
  });
}

export function useAcceptPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => acceptPost(postId),
    onSuccess: () => {
      // Invalidar posts pendientes
      queryClient.invalidateQueries({
        queryKey: ["posts", "pending"],
        exact: false,
      });

      // Invalidar listas generales
      queryClient.invalidateQueries({
        queryKey: ["posts", "list"],
        exact: false,
      });
    },
  });
}

export function useRejectPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => rejectPost(postId),
    onSuccess: () => {
      // Invalidar posts pendientes
      queryClient.invalidateQueries({
        queryKey: ["posts", "pending"],
        exact: false,
      });
    },
  });
}

// Hook compuesto para gestión de posts
export function useOptimizedPosts(
  page: number = 1,
  limit: number = 9,
  filters: any = {},
  userPostsOnly: boolean = false,
  postId?: string
) {
  // Queries condicionales
  const postsQuery = usePostsQuery(page, limit, filters);
  const myPostsQuery = useMyPostsQuery();
  const singlePostQuery = usePostQuery(postId || "", !!postId);

  // Mutations
  const createMutation = useCreatePostMutation();
  const deleteMutation = useDeletePostMutation();

  // Determinar qué datos usar
  const posts = userPostsOnly
    ? Array.isArray(myPostsQuery.data)
      ? myPostsQuery.data
      : (myPostsQuery.data as any)?.data || []
    : (postsQuery.data as GetPostsResponse)?.data || [];

  const post = postId ? singlePostQuery.data : null;

  const loading = userPostsOnly
    ? myPostsQuery.isLoading
    : postId
    ? singlePostQuery.isLoading
    : postsQuery.isLoading;

  const error = userPostsOnly
    ? myPostsQuery.error
    : postId
    ? singlePostQuery.error
    : postsQuery.error;

  return {
    // Data
    posts,
    post,
    totalPages: userPostsOnly
      ? 1
      : (postsQuery.data as GetPostsResponse)?.totalPages || 1,
    totalItems: userPostsOnly
      ? posts.length
      : (postsQuery.data as GetPostsResponse)?.total || 0,
    currentPage: userPostsOnly ? 1 : page,

    // States
    loading,
    error: error?.message || null,

    // Actions
    createPost: createMutation.mutateAsync,
    deletePost: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refresh functions
    refreshPosts: userPostsOnly ? myPostsQuery.refetch : postsQuery.refetch,
    refetch: postId ? singlePostQuery.refetch : postsQuery.refetch,
  };
}
