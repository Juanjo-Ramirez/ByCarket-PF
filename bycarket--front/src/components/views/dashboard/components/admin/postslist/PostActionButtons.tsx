"use client";

import React from "react";
import { acceptPost, rejectPost } from "@/services/vehicle.service";
import { showConfirm, showSuccess, showError } from "@/app/utils/Notifications";

type PostActionButtonsProps = {
  postId: string;
  onActionSuccess: () => void;
};

const PostActionButtons = ({
  postId,
  onActionSuccess,
}: PostActionButtonsProps) => {
  const handleAccept = async () => {
    try {
      await acceptPost(postId);
      showSuccess("El vehículo ha sido publicado exitosamente");
      onActionSuccess();
    } catch (error) {
      showError("No se pudo aprobar el post");
    }
  };

  const handleReject = () => {
    showConfirm(
      "¿Estás seguro de rechazar esta publicación?",
      async () => {
        try {
          await rejectPost(postId);
          showSuccess("El post ha sido rechazado correctamente");
          onActionSuccess();
        } catch (error) {
          showError("No se pudo rechazar el post");
        }
      },
      () => {}
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleAccept}
        className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
      >
        Aprobar
      </button>
      <button
        onClick={handleReject}
        className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
      >
        Rechazar
      </button>
    </div>
  );
};

export default PostActionButtons;
