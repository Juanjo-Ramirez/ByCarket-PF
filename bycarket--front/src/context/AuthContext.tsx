import { create } from "zustand";
import { useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  LoginData,
  RegisterData,
  GoogleProcessLoginResponse,
  getUserData,
  UserDataResponse,
  updateUserData,
  UpdateUserData,
  uploadUserProfileImage,
} from "@/services/api.service";
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
} from "@/services/storage.service";
import { signOut } from "next-auth/react";
import { queryKeys } from "@/lib/react-query";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "premium" | "admin";
  isActive: boolean;
  phone?: number;
  country?: string;
  city?: string;
  address?: string;
  image?: string;
}

// Helper para formatear datos del usuario
const formatUserData = (response: UserDataResponse): User => {
  return {
    id: response.id,
    name: response.name,
    email: response.email,
    role: response.role || "user",
    isActive: response.isActive || false,
    phone: response.phone || undefined,
    country: response.country || undefined,
    city: response.city || undefined,
    address: response.address || undefined,
    image:
      response.image &&
      typeof response.image === "object" &&
      response.image.secure_url
        ? response.image.secure_url
        : typeof response.image === "string"
        ? response.image
        : undefined,
  };
};

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<any>;
  register: (data: RegisterData) => Promise<{ email: string }>;
  logout: () => void;
  initializeAuth: () => void;
  setGoogleUser: (response: GoogleProcessLoginResponse) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  loading: true,

  initializeAuth: () => {
    const storedToken = getAuthToken();
    if (storedToken) {
      set({
        token: storedToken,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      set({ loading: false });
    }
  },

  login: async (data: LoginData) => {
    set({ loading: true });
    try {
      const response: any = await loginUser(data);
      setAuthToken(response.token);

      set({
        token: response.token,
        isAuthenticated: true,
        loading: false,
      });

      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ loading: true });
    try {
      const response = await registerUser(data);
      set({ loading: false });
      return { email: data.email };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    removeAuthToken();
    set({
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    signOut({ callbackUrl: "/login" });
  },

  setGoogleUser: (response: GoogleProcessLoginResponse) => {
    set({
      token: response.token,
      isAuthenticated: true,
      loading: false,
    });
  },
}));
