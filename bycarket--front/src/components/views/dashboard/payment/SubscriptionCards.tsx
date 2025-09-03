import { Check, Star, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  getMonthlyPrice,
  getQuarterlyPrice,
  getAnnualPrice,
  type Price,
} from "@/services/api.service";

const PaymentElement = dynamic(() => import("./EmbeddedCheckout"), {
  ssr: false,
});

interface SubscriptionCardsProps {
  className?: string;
}

interface PlanData {
  id: "monthly" | "quarterly" | "annual";
  name: string;
  popular: boolean;
  features: string[];
  price?: Price;
  loading?: boolean;
  error?: string;
}

export function SubscriptionCards({ className = "" }: SubscriptionCardsProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlanData[]>([
    {
      id: "monthly",
      name: "Mensual",
      popular: false,
      features: [
        "Acceso completo a la plataforma",
        "Soporte por email",
        "Actualizaciones automáticas",
        "Dashboard personalizado",
      ],
      loading: true,
    },
    {
      id: "quarterly",
      name: "Trimestral",
      popular: true,
      features: [
        "Todo lo del plan mensual",
        "Soporte prioritario",
        "Reportes avanzados",
        "Integraciones premium",
        "API access",
      ],
      loading: true,
    },
    {
      id: "annual",
      name: "Anual",
      popular: false,
      features: [
        "Todo lo del plan trimestral",
        "Soporte telefónico 24/7",
        "Consultoría personalizada",
        "Backup automático",
        "SLA garantizado",
        "Multi-usuario",
      ],
      loading: true,
    },
  ]);

  useEffect(() => {
    const loadPrices = async () => {
      const priceLoaders = [
        { id: "monthly", loader: getMonthlyPrice },
        { id: "quarterly", loader: getQuarterlyPrice },
        { id: "annual", loader: getAnnualPrice },
      ] as const;

      for (const { id, loader } of priceLoaders) {
        try {
          const { data: price } = await loader();
          setPlans((prevPlans) =>
            prevPlans.map((plan) =>
              plan.id === id
                ? { ...plan, price, loading: false, error: undefined }
                : plan
            )
          );
        } catch (error) {
          console.error(`Error cargando ${id} precio:`, error);
          setPlans((prevPlans) =>
            prevPlans.map((plan) =>
              plan.id === id
                ? { ...plan, loading: false, error: "Error al cargar precio" }
                : plan
            )
          );
        }
      }
    };

    loadPrices();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    if (selectedPlan === planId) {
      setSelectedPlan(null);
      return;
    }

    setSelectedPlan(planId);
  };

  const formatPrice = (price: Price) => {
    const amount = price.unit_amount / 100;
    return {
      amount,
      currency: price.currency.toUpperCase(),
      period: getPeriodText(price.recurring.interval),
    };
  };

  const getPeriodText = (interval: string) => {
    switch (interval) {
      case "monthly":
        return "mes";
      case "quarterly":
        return "3 meses";
      case "annual":
        return "año";
      default:
        return interval;
    }
  };

  const calculateSavings = (plan: PlanData, monthlyPrice?: number) => {
    if (!plan.price || !monthlyPrice) return null;

    const planPrice = plan.price.unit_amount / 100;
    const intervalCount = plan.price.recurring.interval_count || 1;

    let comparisonMonths = 1;
    if (plan.id === "quarterly") comparisonMonths = 3;
    if (plan.id === "annual") comparisonMonths = 12;

    const expectedPrice = monthlyPrice * comparisonMonths;
    const savings = expectedPrice - planPrice;

    return savings > 0 ? Math.round(savings) : null;
  };

  const monthlyPrice = plans.find((p) => p.id === "monthly")?.price?.unit_amount
    ? plans.find((p) => p.id === "monthly")!.price!.unit_amount / 100
    : undefined;

  return (
    <div className="space-y-8">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {plans.map((plan) => {
          const priceInfo = plan.price ? formatPrice(plan.price) : null;
          const savings = calculateSavings(plan, monthlyPrice);

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

                {plan.loading ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    <span className="text-gray-500 text-sm">
                      Cargando precio...
                    </span>
                  </div>
                ) : plan.error ? (
                  <div className="py-4">
                    <span className="text-red-500 text-sm">{plan.error}</span>
                  </div>
                ) : priceInfo ? (
                  <>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black text-gray-900">
                        ${priceInfo.amount}
                      </span>
                      <span className="text-gray-500 text-sm font-medium">
                        /{priceInfo.period}
                      </span>
                    </div>
                    {savings && (
                      <div className="mt-2">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Ahorra ${savings}
                        </span>
                      </div>
                    )}
                  </>
                ) : null}
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
                disabled={plan.loading || !!plan.error}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:hover:from-blue-500 disabled:hover:to-purple-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:hover:bg-gray-100"
                }`}
              >
                {plan.loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando...
                  </div>
                ) : selectedPlan === plan.id ? (
                  "Ocultar detalles"
                ) : plan.error ? (
                  "No disponible"
                ) : (
                  "Seleccionar plan"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Completar pago - {plans.find((p) => p.id === selectedPlan)?.name}
          </h3>
          <PaymentElement priceId={selectedPlan} />
        </div>
      )}
    </div>
  );
}
