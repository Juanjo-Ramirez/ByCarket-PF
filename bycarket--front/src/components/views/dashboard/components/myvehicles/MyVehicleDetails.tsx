"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiX,
  FiEdit3,
  FiSave,
  FiTrash2,
  FiUpload,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiTruck,
  FiInfo,
  FiTag,
} from "react-icons/fi";
import {
  VehicleResponse,
  updateVehicle,
  uploadVehicleImages,
  deleteVehicleImage,
  getVehicleById,
} from "@/services/vehicle.service";
import { showConfirm, showSuccess, showError } from "@/app/utils/Notifications";
import { useVehiclesStore } from "@/context/VehiclesContext";
import { useSpinner } from "@/context/SpinnerContext";

export default function MyVehicleDetails({
  vehicle: initialVehicle,
  onClose,
  onUpdate,
}: {
  vehicle: VehicleResponse;
  onClose: () => void;
  onUpdate: (updatedVehicle: VehicleResponse) => void;
}) {
  const [vehicleState, setVehicleState] =
    useState<VehicleResponse>(initialVehicle);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const { setLoading } = useSpinner();
  const updateVehicleInState = useVehiclesStore(
    (state) => state.updateVehicleInState
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    setVehicleState(initialVehicle);
  }, [initialVehicle]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVehicleState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    onClose();
    try {
      const updatedData = {
        brandId: vehicleState.brand.id,
        modelId: vehicleState.model.id,
        versionId: vehicleState.version?.id,
        year: vehicleState.year,
        price: vehicleState.price,
        currency: vehicleState.currency,
        mileage: vehicleState.mileage,
        typeOfVehicle: vehicleState.typeOfVehicle,
        condition: vehicleState.condition,
        description: vehicleState.description,
      };
      const updatedVehicle = await updateVehicle(vehicleState.id, updatedData);
      let finalVehicle = updatedVehicle;
      if (newImages.length > 0) {
        setIsUploading(true);
        await uploadVehicleImages(vehicleState.id, newImages);
        finalVehicle = await getVehicleById(vehicleState.id);
        setNewImages([]);
      }
      updateVehicleInState(finalVehicle);
      onUpdate(finalVehicle);
    } catch (error) {
      showError(
        "Error al guardar los cambios. Los cambios no se guardaron correctamente."
      );
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setVehicleState(initialVehicle);
  };

  const removeVehicle = useVehiclesStore((state) => state.removeVehicle);

  const handleDelete = () => {
    showConfirm("¿Estás seguro de eliminar este vehículo?", async () => {
      setLoading(true);
      try {
        const success = await removeVehicle(vehicleState.id);
        if (success) {
          showSuccess("Vehículo eliminado correctamente");
          onClose();
        }
      } catch (error) {
        showError("Error al eliminar el vehículo");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleImageDelete = (publicId: string) => {
    showConfirm("¿Estás seguro de eliminar esta imagen?", async () => {
      setLoading(true);
      try {
        await deleteVehicleImage(vehicleState.id, publicId);
        setVehicleState((prev) => ({
          ...prev,
          images:
            prev.images?.filter((img) => img.public_id !== publicId) || [],
        }));
        showSuccess("La imagen fue eliminada correctamente");
      } catch (error) {
        showError("Error al eliminar la imagen");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicleState.images || [];
  const currentImage =
    images.length > 0
      ? images[currentImageIndex].secure_url
      : "/placeholder-vehicle.jpg";
  const vehicleName = `${vehicleState.brand.name} ${vehicleState.model.name}${
    vehicleState.version?.name ? ` ${vehicleState.version.name}` : ""
  }`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex flex-col items-center py-4 px-2 sm:px-4">
        <div className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] px-4 py-4 md:px-8 md:py-6 text-white">
            <div className="flex justify-between items-center">
              <div className="truncate pr-2">
                <h2 className="text-xl md:text-2xl font-bold truncate">
                  {vehicleState.brand.name} {vehicleState.model.name}
                </h2>
                <p className="text-blue-100 opacity-90 text-sm">
                  Detalles del vehículo
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 md:p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              >
                <FiX className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-2 sm:p-4 bg-gray-50">
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg md:rounded-xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={currentImage}
                  alt={`${vehicleState.brand.name} ${vehicleState.model.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <FiChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-[#103663]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <FiChevronRight className="h-4 w-4 md:h-5 md:w-5 text-[#103663]" />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? "bg-[#103663]"
                              : "bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-2 sm:mt-4 flex overflow-x-auto gap-2 py-2">
                  {images.map((image, index) => (
                    <div
                      key={image.public_id}
                      className={`group relative aspect-square w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden ${
                        index === currentImageIndex
                          ? "ring-2 ring-[#103663]"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image.secure_url}
                        alt={`${vehicleState.brand.name} ${
                          vehicleState.model.name
                        } - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                      {isEditing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageDelete(image.public_id);
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <FiTrash2 className="h-6 w-6 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isEditing && (
                <div className="mt-4">
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#103663] transition-colors"
                  >
                    <FiUpload className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      {newImages.length > 0
                        ? `${newImages.length} imágenes seleccionadas`
                        : "Agregar imágenes"}
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FiDollarSign className="h-6 w-6 md:h-8 md:w-8" />
                    <div>
                      <p className="text-blue-100 text-sm">Precio</p>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <select
                            name="currency"
                            value={vehicleState.currency}
                            onChange={handleSelectChange}
                            className="text-lg font-bold px-2 py-1 border rounded"
                          >
                            <option value="U$D">U$D</option>
                            <option value="AR$">AR$</option>
                          </select>
                          <input
                            type="number"
                            name="price"
                            value={vehicleState.price}
                            onChange={handleInputChange}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold w-full px-2 py-1 border rounded"
                          />
                        </div>
                      ) : (
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                          {vehicleState.currency}{" "}
                          {vehicleState.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl">
                  <h3 className="text-lg md:text-xl font-bold text-[#103663] mb-4 flex items-center gap-2">
                    <FiTruck className="h-5 w-5" />
                    Información del vehículo
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiTruck className="h-4 w-4" />
                        Marca
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {vehicleState.brand.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiTruck className="h-4 w-4" />
                        Modelo
                      </p>
                      <p className="font-semibold text-[#103663]">
                        {vehicleState.model.name}
                      </p>
                    </div>
                    {vehicleState.version && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FiInfo className="h-4 w-4" />
                          Versión
                        </p>
                        <p className="font-semibold text-[#103663]">
                          {vehicleState.version.name}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiCalendar className="h-4 w-4" />
                        Año
                      </p>
                      {isEditing ? (
                        <input
                          type="number"
                          name="year"
                          value={vehicleState.year}
                          onChange={handleInputChange}
                          className="font-semibold text-[#103663] px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        <p className="font-semibold text-[#103663]">
                          {vehicleState.year}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiActivity className="h-4 w-4" />
                        Kilometraje
                      </p>
                      {isEditing ? (
                        <input
                          type="number"
                          name="mileage"
                          value={vehicleState.mileage}
                          onChange={handleInputChange}
                          className="font-semibold text-[#103663] px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        <p className="font-semibold text-[#103663]">
                          {vehicleState.mileage.toLocaleString()} km
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiInfo className="h-4 w-4" />
                        Condición
                      </p>
                      {isEditing ? (
                        <select
                          name="condition"
                          value={vehicleState.condition}
                          onChange={handleSelectChange}
                          className="font-semibold text-[#103663] capitalize px-2 py-1 border rounded w-full"
                        >
                          <option value="new">Nuevo</option>
                          <option value="used">Usado</option>
                        </select>
                      ) : (
                        <p className="font-semibold text-[#103663] capitalize">
                          {vehicleState.condition}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiTag className="h-4 w-4" />
                        Tipo de vehículo
                      </p>
                      {isEditing ? (
                        <select
                          name="typeOfVehicle"
                          value={vehicleState.typeOfVehicle}
                          onChange={handleSelectChange}
                          className="font-semibold text-[#103663] px-2 py-1 border rounded w-full"
                        >
                          <option value="SUV">SUV</option>
                          <option value="PICKUP">Pickup</option>
                          <option value="MINIVAN">Minivan</option>
                          <option value="LIGHT_TRUCK">Camión Ligero</option>
                          <option value="COUPE">Coupé</option>
                          <option value="HATCHBACK">Hatchback</option>
                          <option value="FURGON">Furgón</option>
                          <option value="SEDAN">Sedán</option>
                          <option value="VAN">Van</option>
                          <option value="RURAL">Rural</option>
                          <option value="CABRIOLET">Cabriolet</option>
                          <option value="SPORTSCAR">Deportivo</option>
                          <option value="ROADSTER">Roadster</option>
                          <option value="ELECTRIC">Eléctrico</option>
                          <option value="HYBRID">Híbrido</option>
                          <option value="LUXURY">Lujo</option>
                          <option value="OFF_ROAD">Todo Terreno</option>
                          <option value="PICKUP_TRUCK">Camioneta Pickup</option>
                          <option value="CROSSOVER">Crossover</option>
                          <option value="COMPACT">Compacto</option>
                        </select>
                      ) : (
                        <p className="font-semibold text-[#103663]">
                          {vehicleState.typeOfVehicle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-[#103663] mb-3 flex items-center gap-2">
                    <FiInfo className="h-5 w-5" />
                    Descripción
                  </h3>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={vehicleState.description || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-gray-700 leading-relaxed border rounded"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {vehicleState.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 font-medium"
                    >
                      <FiSave className="h-4 w-4" />
                      Guardar cambios
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                      <FiX className="h-4 w-4" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <FiEdit3 className="h-4 w-4" />
                    Editar vehículo
                  </button>
                )}
              </div>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all duration-200 font-medium"
              >
                <FiTrash2 className="h-4 w-4" />
                {isDeleting ? "Eliminando..." : "Eliminar vehículo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
