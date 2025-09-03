import React from "react";
import { FiUserPlus, FiUpload, FiDollarSign } from "react-icons/fi";

export default function HowItWorks({
  paddingTop = "pt-20",
  paddingBottom = "pb-30",
}) {
  const steps = [
    {
      title: "1. Regístrate gratis",
      description: "Crea tu cuenta como particular o empresa en solo minutos.",
      icon: <FiUserPlus className="text-blue-600" size={48} />,
    },
    {
      title: "2. Publicá tu auto",
      description:
        "Sube fotos, descripción, precio y empezá a recibir visitas.",
      icon: <FiUpload className="text-blue-600" size={48} />,
    },
    {
      title: "3. Vendé sin complicaciones",
      description: "Conectá con compradores interesados de todo el país.",
      icon: <FiDollarSign className="text-blue-600" size={48} />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className={`
        w-full relative bg-white 
        ${paddingTop} ${paddingBottom} 
        px-6 text-center overflow-hidden
      `}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-16">
          ¿Cómo funciona?
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2"
            >
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                {step.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
