import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export default async function Return({ searchParams }: { searchParams: any }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const status = session.status;
  const amountTotal = session.amount_total;
  const currency = session.currency;
  const paymentStatus = session.payment_status;
  const lineItems = session.line_items?.data || [];

  if (status === "open") {
    return redirect("/home");
  }

  if (status === "complete") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Pago Completado
            </h1>
            <p className="text-gray-600">Gracias por tu compra</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total pagado</p>
                  <p className="text-3xl font-bold text-[#103663]">
                    ${amountTotal ? (amountTotal / 100).toFixed(2) : "0.00"}{" "}
                    {currency?.toUpperCase()}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {paymentStatus === "paid" ? "Pagado" : paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información del Cliente
                  </h3>
                  <div className="space-y-3">
                    {customerName && (
                      <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="text-gray-900 font-medium">
                          {customerName}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium break-all">
                        {customerEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detalles de la Transacción
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">ID de Sesión</p>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md overflow-x-auto">
                        <p className="text-gray-900 font-mono text-sm break-all">
                          {session_id}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="text-gray-900 font-medium">
                        {new Date().toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {lineItems.length > 0 && (
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen de Compra
                </h3>
                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start py-3 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900">
                          ${((item.amount_total || 0) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#4a77a8] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Confirmación por Email
                      </h4>
                      <p className="text-sm text-gray-600">
                        Recibirás un correo con los detalles de tu compra
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        ¿Necesitas Ayuda?
                      </h4>
                      <a
                        href="mailto:bycarket@gmail.com"
                        className="text-sm text-[#4a77a8] hover:text-[#103663] transition-colors"
                      >
                        bycarket@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-gray-50 rounded-b-lg">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                <p className="text-sm text-gray-600">
                  Guarda esta información como comprobante de tu transacción
                </p>
                <a
                  href="/home"
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-[#103663] hover:bg-[#0d2b4f] text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Continuar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
