"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/context/AuthContext";

const AuthInitializer = () => {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return null;
};

export default AuthInitializer;
