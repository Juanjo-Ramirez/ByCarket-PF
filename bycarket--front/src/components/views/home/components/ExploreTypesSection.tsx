"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Autos usados",
    description: "Revisados y listos para circular.",
    image: "/assets/images/home/usedCar.webp",
  },
  {
    title: "Autos 0 KM",
    description: "Nuevos, directo de agencia.",
    image: "/assets/images/home/newCar.webp",
  },
  {
    title: "Camionetas y 4x4",
    description: "Potencia y espacio para todo.",
    image: "/assets/images/home/4x4.webp",
  },
];

const ExploreTypesSection = () => {
  return (
    <section className="w-full bg-secondary-blue py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Explorá por tipo de vehículo
        </h2>
        <p className="text-gray-200 text-sm md:text-base">
          Elegí el tipo de auto que estás buscando y descubrí todas las opciones
          disponibles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.title}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.03] transition duration-300 flex flex-col"
          >
            <div className="relative w-full h-48">
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <Link
                href={
                  category.title === "Autos usados"
                    ? "/marketplace?condition=used&page=1"
                    : category.title === "Autos 0 KM"
                    ? "/marketplace?condition=new&page=1"
                    : category.title === "Camionetas y 4x4"
                    ? "/marketplace?typeOfVehicle=PICKUP&typeOfVehicle=MINIVAN&typeOfVehicle=LIGHT_TRUCK&page=1"
                    : "/marketplace"
                }
              >
                <h3 className="text-lg font-semibold text-secondary-blue cursor-pointer hover:underline">
                  {category.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mt-1">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreTypesSection;
