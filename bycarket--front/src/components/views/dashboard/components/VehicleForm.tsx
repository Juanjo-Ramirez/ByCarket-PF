"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useBrandsQuery,
  useModelsQuery,
  useVersionsQuery,
  useCreateVehicleMutation,
} from "@/hooks/queries/useVehicleQueries";
import { VehicleData } from "@/services/vehicle.service";
import { Search, Upload, X } from "lucide-react";
import Image from "next/image";
import { showError, showSuccess, showWarning } from "@/app/utils/Notifications";
import { useSpinner } from "@/context/SpinnerContext";

const VehicleForm: React.FC = () => {
  // React Query hooks
  const { data: brands = [], isLoading: brandsLoading } = useBrandsQuery();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const { data: models = [], isLoading: modelsLoading } =
    useModelsQuery(selectedBrandId);
  const { data: versions = [], isLoading: versionsLoading } =
    useVersionsQuery(selectedModelId);
  const createVehicleMutation = useCreateVehicleMutation();

  const { setLoading } = useSpinner();

  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [versionSearch, setVersionSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);

  // NUEVOS ESTADOS Y REFS PARA SELECTORES PERSONALIZADOS
  const [showTypeOfVehicleDropdown, setShowTypeOfVehicleDropdown] =
    useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const typeOfVehicleDropdownRef = useRef<HTMLDivElement>(null);
  const conditionDropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  // FIN NUEVOS ESTADOS Y REFS

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const versionDropdownRef = useRef<HTMLDivElement>(null);

  const filteredBrands = brands.filter((brand: any) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredModels = models.filter((model: any) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const filteredVersions = versions.filter((version: any) =>
    version.name.toLowerCase().includes(versionSearch.toLowerCase())
  );

  // Helper functions for brand/model/version selection
  const handleBrandChange = (brand: any) => {
    setSelectedBrandId(brand.id);
    setSelectedModelId(""); // Reset model when brand changes
    setBrandSearch(brand.name);
    setShowBrandDropdown(false);
  };

  const handleModelChange = (model: any) => {
    setSelectedModelId(model.id);
    setModelSearch(model.name);
    setShowModelDropdown(false);
  };

  const submitVehicle = async (vehicleData: VehicleData) => {
    try {
      setLoading(true);
      await createVehicleMutation.mutateAsync(vehicleData);
      showSuccess("Vehículo registrado exitosamente");
      // Reset form here if needed
    } catch (error) {
      showError("Error al registrar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  // Opciones para los nuevos selectores personalizados
  const vehicleTypes = [
    "SUV",
    "PICKUP",
    "MINIVAN",
    "LIGHT_TRUCK",
    "COUPE",
    "HATCHBACK",
    "FURGON",
    "SEDAN",
    "VAN",
    "RURAL",
    "CABRIOLET",
    "SPORTSCAR",
    "ROADSTER",
    "ELECTRIC",
    "HYBRID",
    "LUXURY",
    "OFF_ROAD",
    "PICKUP_TRUCK",
    "CROSSOVER",
    "COMPACT",
  ];
  const conditions = ["new", "used"];
  const currencies = ["U$D", "AR$"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        brandDropdownRef.current &&
        !brandDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBrandDropdown(false);
      }
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false);
      }
      if (
        versionDropdownRef.current &&
        !versionDropdownRef.current.contains(event.target as Node)
      ) {
        setShowVersionDropdown(false);
      }
      // CERRAR NUEVOS SELECTORES PERSONALIZADOS
      if (
        typeOfVehicleDropdownRef.current &&
        !typeOfVehicleDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTypeOfVehicleDropdown(false);
      }
      if (
        conditionDropdownRef.current &&
        !conditionDropdownRef.current.contains(event.target as Node)
      ) {
        setShowConditionDropdown(false);
      }
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCurrencyDropdown(false);
      }
      // FIN CERRAR NUEVOS SELECTORES PERSONALIZADOS
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [imageError, setImageError] = useState<string>("");

  const validationSchema = Yup.object().shape({
    brandId: Yup.string().required("La marca es obligatoria"),
    modelId: Yup.string().required("El modelo es obligatorio"),
    versionId: Yup.string().required("La versión es obligatoria"),
    typeOfVehicle: Yup.string().required("El tipo de vehículo es obligatorio"),
    year: Yup.number()
      .required("El año es obligatorio")
      .min(1900, "El año debe ser mayor a 1900")
      .max(new Date().getFullYear(), "No se permiten años futuros"),
    condition: Yup.string().required("La condición es obligatoria"),
    currency: Yup.string()
      .required("La moneda es obligatoria")
      .oneOf(["U$D", "AR$"], "Moneda no válida"),
    price: Yup.number()
      .required("El precio es obligatorio")
      .min(1, "El precio debe ser mayor a 0"),
    mileage: Yup.number()
      .required("El kilometraje es obligatorio")
      .min(0, "El kilometraje no puede ser negativo"),
    description: Yup.string()
      .required("La descripción es obligatoria")
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder los 500 caracteres"),
    images: Yup.array()
      .min(1, "Debes subir al menos una imagen")
      .required("Debes subir al menos una imagen"),
  });

  const formik = useFormik<VehicleData>({
    initialValues: {
      brandId: "",
      modelId: "",
      versionId: "",
      typeOfVehicle: "",
      year: new Date().getFullYear(),
      condition: "",
      currency: "",
      price: 0,
      mileage: 0,
      description: "",
      images: [],
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const errors = await formik.validateForm();

        if (Object.keys(errors).length > 0) {
          let errorMessage = "Por favor, verifica los campos del formulario";

          const firstKey = Object.keys(errors)[0];
          const firstErrorValue = errors[firstKey as keyof typeof errors];

          if (typeof firstErrorValue === "string") {
            errorMessage = firstErrorValue;
          } else if (
            Array.isArray(firstErrorValue) &&
            firstErrorValue.length > 0
          ) {
            if (typeof firstErrorValue[0] === "string") {
              errorMessage = firstErrorValue[0];
            }
          }

          showWarning(errorMessage);
          return;
        }

        const backendValues = {
          ...values,
        };

        await submitVehicle(backendValues);
        showSuccess("Vehículo registrado correctamente");
        resetForm();
        setPreviewImages([]);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          "Ha ocurrido un error inesperado. Inténtalo de nuevo.";
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  // React Query success handling is done in the mutation itself
  // Remove the useEffect for success since mutations handle it

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = previewImages.length + newFiles.length;

    if (totalFiles > 6) {
      setImageError("Máximo 6 imágenes permitidas");
      showWarning("Máximo 6 imágenes permitidas");
      return;
    }

    const oversizedFiles = newFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      setImageError("Algunas imágenes superan 5MB");
      showWarning("Algunas imágenes superan el tamaño máximo de 5MB");
      return;
    }

    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);

    const currentFiles = formik.values.images || [];
    formik.setFieldValue("images", [...currentFiles, ...newFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  const handleBrandSelect = (brandId: string, brandName: string) => {
    formik.setFieldValue("brandId", brandId);
    formik.setFieldValue("modelId", "");
    formik.setFieldValue("versionId", "");
    setBrandSearch(brandName);
    setModelSearch("");
    setVersionSearch("");
    setShowBrandDropdown(false);
    setSelectedBrandId(brandId); // This will trigger models query
  };

  const handleModelSelect = (modelId: string, modelName: string) => {
    formik.setFieldValue("modelId", modelId);
    formik.setFieldValue("versionId", "");
    setModelSearch(modelName);
    setVersionSearch("");
    setShowModelDropdown(false);
    setSelectedModelId(modelId); // This will trigger versions query
  };

  const handleVersionSelect = (versionId: string, versionName: string) => {
    formik.setFieldValue("versionId", versionId);
    setVersionSearch(versionName);
    setShowVersionDropdown(false);
  };

  // NUEVAS FUNCIONES PARA SELECTORES PERSONALIZADOS
  const handleTypeOfVehicleSelect = (type: string) => {
    formik.setFieldValue("typeOfVehicle", type);
    setShowTypeOfVehicleDropdown(false);
  };

  const handleConditionSelect = (condition: string) => {
    formik.setFieldValue("condition", condition);
    setShowConditionDropdown(false);
    // Si la condición es "new", resetea el kilometraje a 0
    if (condition === "new") {
      formik.setFieldValue("mileage", 0);
    }
  };

  const handleCurrencySelect = (currency: string) => {
    formik.setFieldValue("currency", currency);
    setShowCurrencyDropdown(false);
  };
  // FIN NUEVAS FUNCIONES

  const allFieldsValid =
    formik.values.brandId &&
    formik.values.modelId &&
    formik.values.versionId &&
    formik.values.typeOfVehicle &&
    formik.values.year &&
    formik.values.condition &&
    formik.values.currency &&
    formik.values.price > 0 &&
    formik.values.mileage >= 0 &&
    formik.values.description.length >= 10 &&
    formik.values.images.length > 0;

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      {" "}
      {/* AJUSTADO EL PADDING */}
      <h2 className="text-2xl font-bold text-principal-blue mb-6">
        Registrar Vehículo
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative" ref={brandDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar marca"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                onClick={() => setShowBrandDropdown(true)}
                className={`w-full px-3 py-2 border ${
                  formik.touched.brandId && formik.errors.brandId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue pr-10`}
                readOnly={formik.values.brandId !== ""}
              />
              {formik.values.brandId && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    formik.setFieldValue("brandId", "");
                    formik.setFieldValue("modelId", "");
                    formik.setFieldValue("versionId", "");
                    setBrandSearch("");
                    setModelSearch("");
                    setVersionSearch("");
                    setShowBrandDropdown(false); // Asegura que el dropdown se cierre al limpiar
                  }}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
              {!formik.values.brandId && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
            {showBrandDropdown && !formik.values.brandId && (
              <div
                className="absolute z-10 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto"
                style={{
                  width: brandDropdownRef.current?.offsetWidth || "100%",
                }}
              >
                {" "}
                {/* ANCHO DINÁMICO */}
                <div className="py-1">
                  {filteredBrands.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No se encontraron marcas
                    </div>
                  ) : (
                    filteredBrands.map((brand) => (
                      <div
                        key={brand.id}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleBrandSelect(brand.id, brand.name)}
                      >
                        {brand.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {formik.touched.brandId && formik.errors.brandId ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.brandId}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={modelDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  formik.values.brandId
                    ? "Buscar modelo"
                    : "Selecciona una marca primero"
                }
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                onClick={() => {
                  if (formik.values.brandId) setShowModelDropdown(true);
                }}
                className={`w-full px-3 py-2 border ${
                  formik.touched.modelId && formik.errors.modelId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue pr-10 ${
                  !formik.values.brandId ? "bg-gray-100 text-gray-500" : ""
                }`}
                disabled={!formik.values.brandId}
                readOnly={formik.values.modelId !== ""}
              />
              {formik.values.modelId && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    formik.setFieldValue("modelId", "");
                    formik.setFieldValue("versionId", "");
                    setModelSearch("");
                    setVersionSearch("");
                    setShowModelDropdown(false); // Asegura que el dropdown se cierre al limpiar
                  }}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
              {!formik.values.modelId && formik.values.brandId && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
            {showModelDropdown &&
              formik.values.brandId &&
              !formik.values.modelId && (
                <div
                  className="absolute z-10 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto"
                  style={{
                    width: modelDropdownRef.current?.offsetWidth || "100%",
                  }}
                >
                  {" "}
                  {/* ANCHO DINÁMICO */}
                  <div className="py-1">
                    {filteredModels.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No se encontraron modelos
                      </div>
                    ) : (
                      filteredModels.map((model) => (
                        <div
                          key={model.id}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleModelSelect(model.id, model.name)
                          }
                        >
                          {model.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            {formik.touched.modelId && formik.errors.modelId ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.modelId}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={versionDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Versión <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  formik.values.modelId
                    ? "Buscar versión"
                    : "Selecciona un modelo primero"
                }
                value={versionSearch}
                onChange={(e) => setVersionSearch(e.target.value)}
                onClick={() => {
                  if (formik.values.modelId) setShowVersionDropdown(true);
                }}
                className={`w-full px-3 py-2 border ${
                  formik.touched.versionId && formik.errors.versionId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue pr-10 ${
                  !formik.values.modelId ? "bg-gray-100 text-gray-500" : ""
                }`}
                disabled={!formik.values.modelId}
                readOnly={formik.values.versionId !== ""}
              />
              {formik.values.versionId && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    formik.setFieldValue("versionId", "");
                    setVersionSearch("");
                    setShowVersionDropdown(false); // Asegura que el dropdown se cierre al limpiar
                  }}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
              {!formik.values.versionId && formik.values.modelId && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
            {showVersionDropdown &&
              formik.values.modelId &&
              !formik.values.versionId && (
                <div
                  className="absolute z-10 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto"
                  style={{
                    width: versionDropdownRef.current?.offsetWidth || "100%",
                  }}
                >
                  {" "}
                  {/* ANCHO DINÁMICO */}
                  <div className="py-1">
                    {filteredVersions.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No se encontraron versiones
                      </div>
                    ) : (
                      filteredVersions.map((version) => (
                        <div
                          key={version.id}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleVersionSelect(version.id, version.name)
                          }
                        >
                          {version.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            {formik.touched.versionId && formik.errors.versionId ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.versionId}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* NUEVO SELECTOR PERSONALIZADO: TIPO DE VEHÍCULO */}
          <div className="relative" ref={typeOfVehicleDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Vehículo <span className="text-red-500">*</span>
            </label>
            <div
              className={`w-full px-3 py-2 border ${
                formik.touched.typeOfVehicle && formik.errors.typeOfVehicle
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue flex justify-between items-center cursor-pointer`}
              onClick={() =>
                setShowTypeOfVehicleDropdown(!showTypeOfVehicleDropdown)
              }
            >
              {formik.values.typeOfVehicle || "Seleccionar"}
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {showTypeOfVehicleDropdown && (
              <div
                className="absolute z-10 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto"
                style={{
                  width:
                    typeOfVehicleDropdownRef.current?.offsetWidth || "100%",
                }}
              >
                {" "}
                {/* ANCHO DINÁMICO */}
                <div className="py-1">
                  {vehicleTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleTypeOfVehicleSelect(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formik.touched.typeOfVehicle && formik.errors.typeOfVehicle ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.typeOfVehicle}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año <span className="text-red-500">*</span>
            </label>
            <input
              id="year"
              name="year"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.year}
              min={1900}
              max={new Date().getFullYear()}
              className={`w-full px-3 py-2 border ${
                formik.touched.year && formik.errors.year
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue`}
            />
            {formik.touched.year && formik.errors.year ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.year}
              </div>
            ) : null}
          </div>

          {/* NUEVO SELECTOR PERSONALIZADO: CONDICIÓN */}
          <div className="relative" ref={conditionDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condición <span className="text-red-500">*</span>
            </label>
            <div
              className={`w-full px-3 py-2 border ${
                formik.touched.condition && formik.errors.condition
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue flex justify-between items-center cursor-pointer`}
              onClick={() => setShowConditionDropdown(!showConditionDropdown)}
            >
              {formik.values.condition === "new"
                ? "Nuevo"
                : formik.values.condition === "used"
                ? "Usado"
                : "Selecciona una condición"}
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {showConditionDropdown && (
              <div
                className="absolute z-10 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto"
                style={{
                  width: conditionDropdownRef.current?.offsetWidth || "100%",
                }}
              >
                {" "}
                {/* ANCHO DINÁMICO */}
                <div className="py-1">
                  {conditions.map((condition) => (
                    <div
                      key={condition}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleConditionSelect(condition)}
                    >
                      {condition === "new" ? "Nuevo" : "Usado"}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formik.touched.condition && formik.errors.condition ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.condition}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* NUEVO SELECTOR PERSONALIZADO: MONEDA */}
          <div className="relative" ref={currencyDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda <span className="text-red-500">*</span>
            </label>
            <div
              className={`w-full px-3 py-2 border ${
                formik.touched.currency && formik.errors.currency
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue flex justify-between items-center cursor-pointer`}
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            >
              {formik.values.currency || "Seleccione una moneda"}
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {showCurrencyDropdown && (
              <div
                className="absolute z-10 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto"
                style={{
                  width: currencyDropdownRef.current?.offsetWidth || "100%",
                }}
              >
                {" "}
                {/* ANCHO DINÁMICO */}
                <div className="py-1">
                  {currencies.map((currency) => (
                    <div
                      key={currency}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCurrencySelect(currency)}
                    >
                      {currency === "U$D"
                        ? "Dólares (U$D)"
                        : "Pesos Argentinos (AR$)"}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formik.touched.currency && formik.errors.currency ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.currency}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              min={0}
              className={`w-full px-3 py-2 border ${
                formik.touched.price && formik.errors.price
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue`}
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.price}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kilometraje <span className="text-red-500">*</span>
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mileage}
              min={0}
              className={`w-full px-3 py-2 border ${
                formik.touched.mileage && formik.errors.mileage
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue ${
                formik.values.condition === "new"
                  ? "bg-gray-100 text-gray-500"
                  : ""
              }`}
              disabled={formik.values.condition === "new"}
            />
            {formik.touched.mileage && formik.errors.mileage ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.mileage}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className={`w-full px-3 py-2 border ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue`}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[...Array(6)].map((_, index) => {
              const hasImage = index < previewImages.length;
              return (
                <div
                  key={index}
                  className={`relative border-2 ${
                    hasImage
                      ? "border-green-400"
                      : "border-gray-300 border-dashed"
                  } rounded-md aspect-square flex items-center justify-center overflow-hidden ${
                    !hasImage && "cursor-pointer hover:bg-gray-50"
                  }`}
                  onClick={() => !hasImage && fileInputRef.current?.click()}
                >
                  {hasImage ? (
                    <>
                      <Image
                        src={previewImages[index]}
                        alt={`Imagen ${index + 1}`}
                        className="object-cover w-full h-full"
                        width={150}
                        height={150}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {index === 0
                          ? "Imagen principal*"
                          : `Imagen ${index + 1}`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <input
            id="file-upload"
            name="file-upload"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp"
            className="sr-only"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <p>Formatos: JPG, JPEG, PNG o WEBP</p>
            <p>Máximo: 5MB por imagen</p>
          </div>

          {(imageError || (formik.touched.images && formik.errors.images)) && (
            <div className="text-red-500 text-xs mt-1">
              {imageError ||
                (typeof formik.errors.images === "string"
                  ? formik.errors.images
                  : "Debes subir al menos una imagen")}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!allFieldsValid || createVehicleMutation.isPending}
            className="px-6 py-2 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300 disabled:opacity-50"
          >
            {createVehicleMutation.isPending
              ? "Registrando..."
              : "Registrar Vehículo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
