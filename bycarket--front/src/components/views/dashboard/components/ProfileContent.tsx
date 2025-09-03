"use client";

import { useState, useRef } from "react";
import { useUserData } from "@/hooks/useUserData";
import { UpdateUserData } from "@/services/api.service";
import {
  FaTrash,
  FaEdit,
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { useOptimizedUserData } from "@/hooks/queries/useUserQueries";

export default function ProfileContent() {
  const {
    userData,
    loading,
    error,
    updating,
    deleting,
    updateUser,
    deleteAccount,
    refetch,
    uploadProfileImage,
  } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    phone: {
      countryCode: "",
      areaCode: "",
      number: "",
    },
  });
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userData: user } = useOptimizedUserData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#103663] rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#4a77a8] rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 my-6 shadow-lg">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-xl p-6 my-6 shadow-lg">
        <div className="flex items-center">
          <FaUser className="text-yellow-600 mr-3" />
          <p className="text-yellow-700 font-medium">
            No hay datos de usuario disponibles
          </p>
        </div>
      </div>
    );
  }

  const formatPhoneNumber = (phone?: any) => {
    if (!phone) return "No especificado";
    if (
      typeof phone === "object" &&
      phone.countryCode &&
      phone.areaCode &&
      phone.number
    ) {
      const cleanCountryCode = phone.countryCode.startsWith("+")
        ? phone.countryCode
        : `+${phone.countryCode}`;
      return `${cleanCountryCode} (${phone.areaCode}) ${phone.number}`;
    }
    if (typeof phone === "number") {
      const phoneStr = phone.toString();
      if (phoneStr.length === 10) {
        return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(
          3,
          6
        )}-${phoneStr.slice(6)}`;
      }
      return phoneStr;
    }
    return "No especificado";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("phone.")) {
      const phoneField = name.split(".")[1];
      setFormData({
        ...formData,
        phone: {
          ...formData.phone,
          [phoneField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      } as UpdateUserData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      phone: {
        ...formData.phone,
        countryCode: formData.phone.countryCode.startsWith("+")
          ? formData.phone.countryCode
          : `+${formData.phone.countryCode}`,
      },
    };

    const result = await updateUser(dataToSubmit);

    if (result?.success) {
      setUpdateMessage({
        type: "success",
        text: "Datos actualizados correctamente",
      });
      setIsEditing(false);
      setFormData({
        phone: {
          countryCode: "",
          areaCode: "",
          number: "",
        },
      });
      // refetch() eliminado - AuthContext se actualiza automáticamente
    } else {
      setUpdateMessage({
        type: "error",
        text: result?.error || "Error al actualizar datos",
      });
    }

    setTimeout(() => {
      setUpdateMessage(null);
    }, 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      phone: {
        countryCode: "",
        areaCode: "",
        number: "",
      },
    });
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (!result?.success) {
      setUpdateMessage({
        type: "error",
        text: result?.error || "Error al eliminar la cuenta",
      });
      setIsDeleteModalOpen(false);

      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setUpdateMessage({
        type: "error",
        text: "La imagen no debe superar los 1MB",
      });
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadProfileImage(file);
      if (result?.success) {
        setUpdateMessage({
          type: "success",
          text: "Imagen de perfil actualizada correctamente",
        });
        // refetch() eliminado - AuthContext se actualiza automáticamente
      } else {
        setUpdateMessage({
          type: "error",
          text: result?.error || "Error al actualizar la imagen",
        });
      }
    } catch (error) {
      setUpdateMessage({
        type: "error",
        text: "Error al subir la imagen",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getCurrentPhoneData = () => {
    if (userData?.phone && typeof userData.phone === "object") {
      return userData.phone;
    }
    return {
      countryCode: "",
      areaCode: "",
      number: "",
    };
  };

  const borderColorClass =
    user?.role === "admin"
      ? "border-purple-200"
      : user?.role === "premium"
      ? "border-yellow-200"
      : "border-white";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {updateMessage && (
          <div
            className={`mb-8 p-4 rounded-xl shadow-lg border-l-4 ${
              updateMessage.type === "success"
                ? "bg-gradient-to-r from-green-50 to-green-100 border-green-500 text-green-800"
                : "bg-gradient-to-r from-red-50 to-red-100 border-red-500 text-red-800"
            } transform transition-all duration-300 animate-pulse`}
          >
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-3 ${
                  updateMessage.type === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="font-medium">{updateMessage.text}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
              <p className="text-blue-100 text-lg">
                Gestiona tu información personal
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="relative group">
                      {userData?.image &&
                      typeof userData.image === "string" &&
                      userData.image.trim() !== "" ? (
                        <div
                          className="relative w-48 h-48 rounded-full cursor-pointer transform transition-all duration-300 group-hover:scale-105"
                          onClick={handleImageClick}
                        >
                          <div
                            className={`absolute inset-0 rounded-full z-0 blur-md opacity-70 animate-pulse ${
                              user?.role === "admin"
                                ? "bg-gradient-to-br from-purple-300 to-purple-600"
                                : user?.role === "premium"
                                ? "bg-gradient-to-br from-yellow-300 to-yellow-500"
                                : "bg-gradient-to-br from-gray-300 to-gray-500"
                            }`}
                          ></div>

                          <div
                            className={`relative w-full h-full rounded-full overflow-hidden border-4 shadow-2xl z-10 ${borderColorClass}`}
                          >
                            <Image
                              src={userData.image}
                              alt={userData.name || "Usuario"}
                              fill
                              className="object-cover"
                              priority
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                            {isUploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="relative w-48 h-48 rounded-full cursor-pointer transform transition-all duration-300 group-hover:scale-105"
                          onClick={handleImageClick}
                        >
                          <div
                            className={`absolute inset-0 rounded-full z-0 blur-md opacity-70 animate-pulse ${
                              user?.role === "admin"
                                ? "bg-gradient-to-br from-purple-300 to-purple-600"
                                : user?.role === "premium"
                                ? "bg-gradient-to-br from-yellow-300 to-yellow-500"
                                : "bg-gradient-to-br from-gray-300 to-gray-500"
                            }`}
                          ></div>

                          <div
                            className={`relative w-full h-full rounded-full bg-gradient-to-br from-[#103663] to-[#4a77a8] flex items-center justify-center text-white text-6xl font-bold border-4 shadow-2xl z-10 ${borderColorClass}`}
                          >
                            {userData?.name ? getInitials(userData.name) : "U"}
                            {isUploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleImageClick}
                        className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white rounded-full p-3 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 group-hover:rotate-12"
                      >
                        <FaCamera className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        const currentPhone = getCurrentPhoneData();
                        setIsEditing(true);
                        setFormData({
                          phone: {
                            countryCode: currentPhone.countryCode || "",
                            areaCode: currentPhone.areaCode || "",
                            number: currentPhone.number || "",
                          },
                          country: userData.country,
                          city: userData.city,
                          address: userData.address,
                        });
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white rounded-xl hover:from-[#0f2f56] hover:to-[#3d6691] transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <FaEdit className="w-5 h-5" />
                      <span>Editar Perfil</span>
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <FaTrash className="w-5 h-5" />
                      <span>Eliminar Cuenta</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                          <FaUser className="text-[#103663]" />
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || userData.name || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50"
                          disabled
                        />
                        <p className="text-sm text-gray-500 mt-2 ml-1">
                          Tu nombre puede aparecer en tus publicaciones o
                          anuncios.
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                          <FaEnvelope className="text-[#103663]" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || userData.email || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50"
                          disabled
                        />
                        <p className="text-sm text-gray-500 mt-2 ml-1">
                          Tu email es privado.
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                          <FaPhone className="text-[#103663]" />
                          Teléfono
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Código País
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="phone.countryCode"
                                value={formData.phone.countryCode || ""}
                                onChange={handleInputChange}
                                placeholder="54"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Código Área
                            </label>
                            <input
                              type="text"
                              name="phone.areaCode"
                              value={formData.phone.areaCode || ""}
                              onChange={handleInputChange}
                              placeholder="11"
                              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Número
                            </label>
                            <input
                              type="text"
                              name="phone.number"
                              value={formData.phone.number || ""}
                              onChange={handleInputChange}
                              placeholder="12345678"
                              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                          <FaGlobe className="text-[#103663]" />
                          País
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                          <FaMapMarkerAlt className="text-[#103663]" />
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                          <FaHome className="text-[#103663]" />
                          Dirección
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:border-[#103663] focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-all duration-300 hover:border-gray-400"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-8 py-3 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white rounded-xl hover:from-[#0f2f56] hover:to-[#3d6691] transition-all duration-300 disabled:opacity-70 font-medium flex items-center gap-2 shadow-lg"
                      >
                        {updating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Actualizando...</span>
                          </>
                        ) : (
                          <span>Guardar Cambios</span>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Información Personal
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                          className={`relative p-1 rounded-2xl transition-all duration-300 shadow-xl ${
                            user?.role === "admin"
                              ? "bg-gradient-to-br from-purple-300 to-purple-500"
                              : user?.role === "premium"
                              ? "bg-gradient-to-br from-yellow-300 to-yellow-500"
                              : "bg-gradient-to-br from-gray-300 to-gray-400"
                          }`}
                        >
                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                              <FaUser className="text-[#103663] text-xl" />
                              <h3 className="text-lg font-semibold text-gray-700">
                                Nombre
                              </h3>
                            </div>
                            <p className="text-xl font-medium text-gray-900 mb-2">
                              {userData.name}
                            </p>
                            <RoleBadge />
                            <p className="text-sm text-gray-500 mt-2">
                              Tu nombre puede aparecer en tus publicaciones o
                              anuncios.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 max-w-full">
                          <div className="flex items-center gap-3 mb-3">
                            <FaEnvelope className="text-[#103663] text-xl" />
                            <h3 className="text-lg font-semibold text-gray-700">
                              Email
                            </h3>
                          </div>
                          <p className="text-xl font-medium text-gray-900 mb-2 break-words max-w-full">
                            {userData.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tu email es privado.
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <FaPhone className="text-[#103663] text-xl" />
                            <h3 className="text-lg font-semibold text-gray-700">
                              Teléfono
                            </h3>
                          </div>
                          <p className="text-xl font-medium text-gray-900">
                            {formatPhoneNumber(userData.phone)}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <FaGlobe className="text-[#103663] text-xl" />
                            <h3 className="text-lg font-semibold text-gray-700">
                              País
                            </h3>
                          </div>
                          <p className="text-xl font-medium text-gray-900">
                            {userData.country || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <FaMapMarkerAlt className="text-[#103663] text-xl" />
                            <h3 className="text-lg font-semibold text-gray-700">
                              Ciudad
                            </h3>
                          </div>
                          <p className="text-xl font-medium text-gray-900">
                            {userData.city || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <FaHome className="text-[#103663] text-xl" />
                            <h3 className="text-lg font-semibold text-gray-700">
                              Dirección
                            </h3>
                          </div>
                          <p className="text-xl font-medium text-gray-900">
                            {userData.address || "No especificado"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar cuenta"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Eliminar cuenta?
            </h3>
            <p className="text-gray-600">
              Esta acción no se puede deshacer. Todos tus datos serán eliminados
              permanentemente.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 font-medium shadow-lg"
            >
              {deleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <FaTrash className="w-4 h-4" />
                  <span>Eliminar Cuenta</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
