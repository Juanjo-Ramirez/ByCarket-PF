"use client";

import React from "react";
import { FaMagic } from "react-icons/fa";
import { useOptimizedUserData } from "@/hooks/queries/useUserQueries";

type GenerateAIButtonProps = {
  onClick: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
};

const GenerateAIButton = ({
  onClick,
  isGenerating = false,
  disabled = false,
}: GenerateAIButtonProps) => {
  const { userData } = useOptimizedUserData();
  const isPremiumUser =
    userData?.role === "premium" || userData?.role === "admin";

  if (!isPremiumUser) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isGenerating || disabled}
      className="text-sm flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-secondary-blue/10 to-principal-blue/5 text-principal-blue rounded-lg hover:from-secondary-blue/20 hover:to-principal-blue/10 transition-all disabled:opacity-50 border border-secondary-blue/20"
    >
      {isGenerating ? (
        "Generando..."
      ) : (
        <>
          <FaMagic className="text-secondary-blue" />
          <span>Generar con IA</span>
        </>
      )}
    </button>
  );
};

export default GenerateAIButton;
