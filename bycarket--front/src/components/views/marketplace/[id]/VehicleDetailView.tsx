"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import QuestionModal from "../components/QuestionModal";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOptimizedUserData } from "@/hooks/queries/useUserQueries";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import PostCarousel from "./UserFeaturedProducts";
import { getUserFeaturedProducts } from "@/services/api.service";
import { Post } from "./UserFeaturedProducts";

const VehicleDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const { post, loading, error } = useFetchPosts(1, 10, {}, false, postId);
  const vehicle = post?.vehicle;
  const { userData: user } = useOptimizedUserData();
  const [featuredProducts, setFeaturedProducts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      if (post && post.user && post.user.id) {
        const userId = post.user.id;
        try {
          const response = await getUserFeaturedProducts(userId);
          const products = Array.isArray(response.data) ? response.data : [];
          const filteredProducts = products.filter((p: any) => p.id !== postId);
          setFeaturedProducts(filteredProducts);
        } catch (error) {
          setFeaturedProducts([]);
        }
      } else {
        setFeaturedProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, [post, postId]);

  const fechaPublicacion = post?.postDate
    ? new Date(post.postDate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Fecha no disponible";

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-white text-lg font-semibold">
        Cargando detalles del vehículo...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-red-500 font-semibold">
        {error}
      </div>
    );

  if (!vehicle)
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-white text-lg font-semibold">
        Vehículo no encontrado.
      </div>
    );

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-principal-blue/10 to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Sección Superior */}
        <div className="flex flex-col lg:flex-row bg-white gap-4 p-3 border border-gray-200 rounded-t-md rounded-br-md">
          {/* Bloque de IMÁGENES */}
          <div className="flex-1 space-y-6 order-1 lg:order-1">
            {/* Galería de imágenes */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
              {vehicle.images?.length ? (
                <>
                  <Image
                    src={vehicle.images[currentImageIndex].secure_url}
                    alt={`${vehicle.brand?.name} ${vehicle.model?.name}`}
                    fill
                    priority
                    className="object-contain"
                  />
                  <button
                    onClick={handlePrev}
                    aria-label="Anterior"
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Siguiente"
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs rounded-full px-3 py-1 font-mono select-none">
                    {currentImageIndex + 1} / {vehicle.images.length}
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-400 font-semibold">
                  No hay imágenes disponibles
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {vehicle.images?.length > 1 && (
              <div className="mt-4 flex justify-center flex-wrap gap-2">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-24 aspect-[4/3] rounded-md overflow-hidden border-2 transition ${
                      idx === currentImageIndex
                        ? "border-principal-blue"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img.secure_url}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TÍTULO + PRECIO + CARACTERÍSTICAS */}
          <div className="lg:flex-[1] lg:max-w-sm flex flex-col gap-6 order-2 lg:order-2">
            <div>
              <p className="text-sm text-gray-500 mt-1">
                Publicado el {fechaPublicacion}
              </p>
              <h1 className="text-4xl font-extrabold text-principal-blue leading-tight">
                {vehicle.brand?.name}{" "}
                <span className="text-secondary-blue">
                  {vehicle.model?.name}
                </span>
              </h1>
              {vehicle.version?.name && (
                <p className="text-lg font-medium text-gray-600 mt-2">
                  {vehicle.version.name}
                </p>
              )}
              <h2 className="pt-4 text-gray-900 font-semibold text-3xl">
                {vehicle.currency} {vehicle.price.toLocaleString()}
              </h2>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <ul className="text-lg text-black space-y-2">
                <li>
                  <strong className="text-principal-blue">Año:</strong>{" "}
                  {vehicle.year}
                </li>
                <li>
                  <strong className="text-principal-blue">Condición:</strong>{" "}
                  {vehicle.condition === "used"
                    ? "Usado"
                    : vehicle.condition === "new"
                    ? "Nuevo"
                    : vehicle.condition}
                </li>
                <li>
                  <strong className="text-principal-blue">Kilometraje:</strong>{" "}
                  {vehicle.mileage.toLocaleString()} km
                </li>
                <li>
                  <strong className="text-principal-blue">Tipo:</strong>{" "}
                  {vehicle.typeOfVehicle}
                </li>
              </ul>
            </div>

            {/* Modal + contacto */}
            <div className="flex flex-col gap-4 pt-3">
              {user?.id !== post?.user?.id && <QuestionModal />}
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Image
                src="/assets/images/logo/Logoo.webp"
                alt="logoByCarket"
                width={40}
                height={40}
                className="h-20 w-20 opacity-4"
              />
              <Image
                src="/assets/images/logo/Logoo.webp"
                alt="logoByCarket"
                width={40}
                height={40}
                className="h-20 w-20 opacity-6"
              />
              <Image
                src="/assets/images/logo/Logoo.webp"
                alt="logoByCarket"
                width={40}
                height={40}
                className="h-20 w-20 opacity-10"
              />
              <Image
                src="/assets/images/logo/Logoo.webp"
                alt="logoByCarket"
                width={40}
                height={40}
                className="h-20 w-20 opacity-14"
              />
            </div>
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 rounded items-start mt-6">
            {/* DESCRIPCIÓN */}
            <div className="flex-1 lg:w-8/12 bg-white p-6 prose max-w-none text-black border border-gray-200 rounded-md">
              <h2 className="text-2xl font-semibold mb-6 text-principal-blue">
                Descripción
              </h2>
              <p className="whitespace-pre-line">
                {vehicle.description || "Sin descripción disponible."}
              </p>
            </div>

            {/* CONSEJOS + CONTACTO */}
            <div className="w-full lg:w-4/12 flex flex-col gap-6">
              {/* Consejos de seguridad */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <h3 className="text-base font-semibold mb-2 text-principal-blue">
                  Consejos de seguridad
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                  <li>
                    Nunca compartas contraseñas, PIN o códigos por WhatsApp, SMS
                    o email.
                  </li>
                  <li>
                    No hagas pagos anticipados antes de ver el vehículo en
                    persona.
                  </li>
                  <li>ByCarket no almacena vehículos.</li>
                  <li>
                    Verificá el remitente de los emails que dicen ser de
                    ByCarket.
                  </li>
                  <li>Dudá de ofertas debajo del precio de mercado.</li>
                </ul>
              </div>

              {/* Contacto por email */}
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                <p className="text-base font-semibold mb-1 text-gray-900">
                  ¿Tenés dudas?
                </p>
                <p className="text-black text-sm">
                  Contactanos a{" "}
                  <a
                    href="mailto:bycarket@gmail.com"
                    className="text-principal-blue underline hover:text-principal-blue/80"
                  >
                    bycarket@gmail.com
                  </a>{" "}
                  y nos pondremos en contacto contigo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <PostCarousel posts={featuredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailView;
