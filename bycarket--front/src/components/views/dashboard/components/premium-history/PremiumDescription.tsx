import React from "react";
import { Bot, MessageSquare, Zap } from "lucide-react";

export default function SubscriptionDescription() {
  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "IA para Publicaciones",
      description: "Genera descripciones optimizadas automáticamente",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Respuestas Inteligentes",
      description: "Responde consultas de compradores con IA",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Análisis Avanzado",
      description: "Insights del mercado y precio sugerido",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#103663] mb-6">
            Tu Suscripción Premium
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <div className="text-[#4a77a8] mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-[#103663] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#103663] mb-2">
              ¿Qué incluye tu plan Premium?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Accede a herramientas de inteligencia artificial que optimizan tus
              publicaciones, generan descripciones atractivas automáticamente y
              responden preguntas de potenciales compradores. Maximiza tus
              ventas con tecnología de vanguardia diseñada específicamente para
              el mercado automotor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
