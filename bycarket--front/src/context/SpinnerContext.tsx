"use client";

import React, { createContext, useContext, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface SpinnerContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const SpinnerContext = createContext<SpinnerContextType>({
  loading: false,
  setLoading: () => {},
});

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <SpinnerContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
          <LoadingSpinner size={60} color="#103663" />
        </div>
      )}
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => useContext(SpinnerContext);
