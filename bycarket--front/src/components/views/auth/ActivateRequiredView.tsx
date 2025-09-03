"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resendActivationEmail } from "@/services/api.service";

export default function ActivateRequiredView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setToast({
      visible: true,
      title,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleResendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      showToast("Error", "Por favor ingresa tu correo electrónico", "error");
      return;
    }

    setIsLoading(true);
    try {
      await resendActivationEmail(email);
      showToast(
        "Correo enviado",
        "Hemos enviado un nuevo enlace de activación a tu correo electrónico.",
        "success"
      );
    } catch (error) {
      showToast(
        "Error",
        "No se pudo enviar el correo de activación. Por favor, inténtalo de nuevo más tarde.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ¡Registro exitoso!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hemos enviado un correo de activación a{" "}
            <span className="font-semibold">{email}</span>
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-center text-sm text-blue-800">
              Por favor revisa tu correo electrónico (incluyendo la carpeta de
              spam) y haz clic en el enlace de activación para completar tu
              registro.
            </p>
          </div>
        </div>

        {toast.visible && (
          <div
            className={`p-4 rounded-md ${
              toast.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="font-medium">{toast.title}</div>
            <div className="text-sm">{toast.message}</div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <p className="text-center text-gray-600 mb-4">
              ¿No recibiste el correo de activación? Ingresa tu correo
              electrónico y te enviaremos otro.
            </p>

            <form onSubmit={handleResendEmail} className="space-y-4">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Reenviar correo de activación"}
              </button>
            </form>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
