"use client";

import { useOptimizedUserData } from "@/hooks/queries/useUserQueries";

// Hook de compatibilidad que mantiene la misma interfaz
export const useUserData = () => {
  return useOptimizedUserData();
};
