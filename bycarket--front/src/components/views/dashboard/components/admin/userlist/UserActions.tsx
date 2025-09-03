"use client";

import React, { useState } from "react";
import { banUser } from "@/services/api.service";
import { FaBan } from "react-icons/fa";

interface UserActionsProps {
  userId: string;
  onActionComplete: () => void;
}

const UserActions = ({ userId, onActionComplete }: UserActionsProps) => {
  const [loading, setLoading] = useState(false);

  const handleBanUser = async () => {
    if (confirm("¿Estás seguro que deseas banear a este usuario?")) {
      setLoading(true);
      try {
        await banUser(userId);
        onActionComplete();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleBanUser}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-3 py-2 bg-[#364153] text-white rounded-md hover:bg-opacity-90 transition-colors w-full disabled:opacity-50"
    >
      <FaBan />
      {loading ? "Procesando..." : "Banear"}
    </button>
  );
};

export default UserActions;
