import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Mantener cache por 10 minutos
      gcTime: 10 * 60 * 1000,
      // Reintentos en caso de error
      retry: 1,
      // Refetch cuando la ventana recupera el foco
      refetchOnWindowFocus: false,
      // Refetch cuando se reconecta
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentos para mutaciones
      retry: 1,
    },
  },
});

// Query Keys para consistencia
export const queryKeys = {
  // User queries
  user: {
    me: ["user", "me"] as const,
    list: (page: number, search: string) =>
      ["users", "list", page, search] as const,
  },
  // Vehicle queries
  vehicles: {
    me: ["vehicles", "me"] as const,
    list: (page: number, limit: number) =>
      ["vehicles", "list", page, limit] as const,
    detail: (id: string) => ["vehicles", "detail", id] as const,
    brands: ["vehicles", "brands"] as const,
    models: (brandId?: string) => ["vehicles", "models", brandId] as const,
    versions: (modelId?: string) => ["vehicles", "versions", modelId] as const,
  },
  // Post queries
  posts: {
    me: ["posts", "me"] as const,
    list: (page: number, limit: number, filters: any) =>
      ["posts", "list", page, limit, filters] as const,
    detail: (id: string) => ["posts", "detail", id] as const,
    pending: (page: number, limit: number) =>
      ["posts", "pending", page, limit] as const,
  },
  // Subscription queries
  subscription: {
    prices: {
      monthly: ["subscription", "prices", "monthly"] as const,
      quarterly: ["subscription", "prices", "quarterly"] as const,
      annual: ["subscription", "prices", "annual"] as const,
    },
    me: ["subscription", "me"] as const,
    invoices: ["subscription", "invoices"] as const,
  },
  // Other queries
  scraper: ["scraper", "data"] as const,
} as const;
