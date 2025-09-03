import { CreditCard, ShieldCheck } from "lucide-react";

interface PaymentHeaderProps {
  className?: string;
}

export function PaymentHeader({ className = "" }: PaymentHeaderProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-white to-slate-50/30 p-8 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm mb-8 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20"></div>
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Métodos de Pago
              </h2>
              <p className="text-base text-gray-600 font-medium">
                Gestiona tus métodos de pago y suscripciones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50/80 rounded-full border border-green-200/50">
            <div className="relative">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-30"></div>
            </div>
            <span className="text-sm font-semibold text-green-700 whitespace-nowrap">
              Pagos seguros con Stripe
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>SSL Encriptado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Protección de datos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
