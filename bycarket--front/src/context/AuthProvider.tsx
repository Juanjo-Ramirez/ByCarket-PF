"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "./AuthContext";
import { useSession } from "next-auth/react";
import { processGoogleLogin } from "@/services/api.service";
import { setAuthToken } from "@/services/storage.service";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const loading = useAuthStore((state) => state.loading);
  const setGoogleUser = useAuthStore((state) => state.setGoogleUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: session, status } = useSession();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleGoogleSession = async () => {
      if (session?.user && status === "authenticated" && !isAuthenticated) {
        try {
          const backendResponse = await processGoogleLogin(session.user);
          if (backendResponse) {
            if (backendResponse.token) {
              setAuthToken(backendResponse.token);
            }
            setGoogleUser(backendResponse);
            // React Query will handle user data automatically
          }
        } catch (error) {}
      }
    };

    if (status === "authenticated" && !isAuthenticated) {
      handleGoogleSession();
    }
  }, [session, status, setGoogleUser, isAuthenticated]);

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
      </div>
    );
  }

  return <>{children}</>;
};
