import { Check, Star } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Price,
  getMonthlyPrice,
  getQuarterlyPrice,
  getAnnualPrice,
} from "@/services/api.service";

const PaymentElement = dynamic(() => import("./EmbeddedCheckout"), {
  ssr: false,
});

interface SubscriptionCardsProps {
  className?: string;
  onSelectPlan?: (planId: string | null) => void;
  selectedPlanId?: string | null;
}

export function SubscriptionCards({
  className = "",
  onSelectPlan,
  selectedPlanId,
}: SubscriptionCardsProps) {
  const [prices, setPrices] = useState<Record<string, Price>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const [monthly, quarterly, annual] = await Promise.all([
          getMonthlyPrice(),
          getQuarterlyPrice(),
          getAnnualPrice(),
        ]);

        setPrices({
          monthly: monthly.data,
          quarterly: quarterly.data,
          annual: annual.data,
        });
      } catch (error) {
        console.error("Error cargando precios:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  const plans = [
    {
      id: "monthly",
      name: "Mensual",
      period: "mes",
      popular: false,
      features: [
        "Acceso completo a la plataforma",
        "Soporte por email",
        "Actualizaciones automáticas",
        "Dashboard personalizado",
      ],
    },
    {
      id: "quarterly",
      name: "Trimestral",
      period: "3 meses",
      popular: true,
      features: [
        "Todo lo del plan mensual",
        "Soporte prioritario",
        "Reportes avanzados",
        "Integraciones premium",
        "API access",
      ],
    },
    {
      id: "annual",
      name: "Anual",
      period: "año",
      popular: false,
      features: [
        "Todo lo del plan trimestral",
        "Soporte telefónico 24/7",
        "Consultoría personalizada",
        "Backup automático",
        "SLA garantizado",
        "Multi-usuario",
      ],
    },
  ];

  const handleSelectPlan = async (planId: string) => {
    const priceId = prices[planId]?.id;
    if (!priceId) return;

    if (selectedPlanId === priceId) {
      onSelectPlan?.(null);
      return;
    }

    onSelectPlan?.(priceId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {plans.map((plan) => {
          const price = prices[plan.id];
          if (!price) return null;

          return (
            <div
              key={plan.id}
              className={`relative group bg-white rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20"
                  : "shadow-lg hover:shadow-xl border border-gray-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Star className="h-4 w-4 fill-current" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    ${(price.unit_amount / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {selectedPlanId === prices[plan.id]?.id
                  ? "Ocultar detalles"
                  : "Seleccionar plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
