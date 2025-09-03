"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { activateAccount } from "@/services/api.service";
import Link from "next/link";

export default function ActivateView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token de activación no válido");
        return;
      }

      try {
        console.log("Intentando activar con token:", token);
        const result = await activateAccount(token);
        console.log("Respuesta del servidor:", result);

        setStatus("success");
        setMessage("¡Cuenta activada exitosamente!");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error: any) {
        console.error("Error en la activación:", error);

        const errorStatus = error?.response?.status;
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Error desconocido";

        if (errorStatus === 400 || errorStatus === 404) {
          setStatus("success");
          setMessage("Tu cuenta ya está activada. Puedes iniciar sesión.");

          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(`Error al activar la cuenta: ${errorMessage}`);
        }
      }
    };

    if (token) {
      activate();
    } else {
      setStatus("error");
      setMessage("No se proporcionó un token de activación válido.");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === "loading"
              ? "Activando cuenta..."
              : status === "success"
              ? "¡Cuenta Activada!"
              : "Error de Activación"}
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <p className="text-center text-gray-600">{message}</p>
          </div>

          {status === "success" && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Serás redirigido automáticamente al inicio de sesión...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col space-y-4">
              <Link href="/login" className="w-full">
                <button className="w-full py-2 px-4 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300">
                  Volver al inicio de sesión
                </button>
              </Link>
              <button
                className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-md transition duration-300 hover:bg-gray-50"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
