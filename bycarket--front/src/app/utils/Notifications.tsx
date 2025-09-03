import {
  toast,
  ToastContainer,
  ToastOptions,
  TypeOptions,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./notifications.css";
import { ReactNode } from "react";

const MAX_TOASTS = 2;

const toastBaseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  className: "toast",
};

const ToastContent = ({
  message,
  type = "default",
}: {
  message: string;
  type?: TypeOptions;
}) => (
  <div className="toast-content">
    <p className="toast-message">{message}</p>
  </div>
);

export const showSuccess = (message: string, options: ToastOptions = {}) => {
  toast(<ToastContent message={message} type="success" />, {
    ...toastBaseOptions,
    className: "toast toast-success",
    ...options,
  });
};

export const showError = (message: string, options: ToastOptions = {}) => {
  toast(<ToastContent message={message} type="error" />, {
    ...toastBaseOptions,
    className: "toast toast-error",
    ...options,
  });
};

export const showWarning = (message: string, options: ToastOptions = {}) => {
  toast(<ToastContent message={message} type="warning" />, {
    ...toastBaseOptions,
    className: "toast toast-warning",
    ...options,
  });
};

export const showInfo = (message: string, options: ToastOptions = {}) => {
  toast(<ToastContent message={message} type="info" />, {
    ...toastBaseOptions,
    className: "toast toast-info",
    ...options,
  });
};

export const showPremiumRequired = (options: ToastOptions = {}) => {
  toast(
    <ToastContent
      message="Debes actualizar a Premium para publicar más de 3 vehículos"
      type="info"
    />,
    {
      ...toastBaseOptions,
      className: "toast toast-info",
      ...options,
    }
  );
};

export const showConfirm = (
  message: ReactNode,
  onYes: () => void,
  onNo?: () => void,
  options: ToastOptions = {}
) => {
  const handleYes = () => {
    onYes();
    if (toastId) {
      toast.dismiss(toastId);
    }
  };

  const handleNo = () => {
    onNo?.();
    if (toastId) {
      toast.dismiss(toastId);
    }
  };

  const toastId = toast(
    <div className="confirm-dialog">
      <div className="confirm-message">{message}</div>
      <div className="confirm-buttons">
        <button className="confirm-btn" onClick={handleNo}>
          No
        </button>
        <button className="confirm-btn confirm-yes" onClick={handleYes}>
          Sí
        </button>
      </div>
    </div>,
    {
      ...toastBaseOptions,
      autoClose: false,
      closeOnClick: false,
      className: "toast confirm-toast",
      ...options,
    }
  );
};

export const NotificationsContainer = () => (
  <ToastContainer limit={MAX_TOASTS} />
);
