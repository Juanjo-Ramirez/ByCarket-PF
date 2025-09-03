import React, { useState, useEffect } from "react";
import { Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  getAllUserInvoices,
  updateUserSubscription,
  type Invoice,
} from "@/services/api.service";
import { showError, showSuccess } from "@/app/utils/Notifications";

const formatCurrency = (amount: string): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(amount));
};

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

const getStatusIcon = (status: string | null) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />;
    case "open":
      return <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />;
    case "uncollectible":
    case "void":
      return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />;
    case "draft":
      return <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />;
    default:
      return <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />;
  }
};

const getStatusText = (status: string | null): string => {
  switch (status) {
    case "paid":
      return "Pagada";
    case "open":
      return "Pendiente";
    case "uncollectible":
      return "No cobrable";
    case "void":
      return "Anulada";
    case "draft":
      return "Borrador";
    default:
      return "Sin estado";
  }
};

const getStatusColor = (status: string | null): string => {
  switch (status) {
    case "paid":
      return "bg-green-50 text-green-700 border-green-200";
    case "open":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "uncollectible":
    case "void":
      return "bg-red-50 text-red-700 border-red-200";
    case "draft":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-500 border-gray-200";
  }
};

export default function InvoiceSection() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllUserInvoices();
        if (data && data.length > 0) {
          setInvoices(data);
        } else {
          setError("No se encontraron facturas");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setError("Error al cargar las facturas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = (invoice: Invoice) => {
    if (invoice.invoice_pdf) {
      window.open(invoice.invoice_pdf, "_blank");
      showSuccess("Descargando factura");
    } else {
      showError("No se pudo descargar la factura");
    }
  };

  const handleViewHosted = (invoice: Invoice) => {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, "_blank");
      showSuccess("Abriendo factura en línea");
    } else {
      showError("No se pudo abrir la factura");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await updateUserSubscription();
      showSuccess("Suscripción cancelada exitosamente");
      const data = await getAllUserInvoices();
      if (data) {
        setInvoices(data);
      }
    } catch (error) {
      showError("Error al cancelar la suscripción");
    }
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <p className="text-center text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoices.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <p className="text-center text-gray-600">
                No hay facturas disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Historial de Facturas</h2>
              <button
                onClick={() => setShowConfirmDialog(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Cancelar Suscripción
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left">Fecha</th>
                    <th className="py-3 px-4 text-left">Estado</th>
                    <th className="py-3 px-4 text-left">Monto</th>
                    <th className="py-3 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice: Invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200">
                      <td className="py-3 px-4">
                        {formatDate(invoice.period_end)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewHosted(invoice)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              ¿Confirmar cancelación?
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas cancelar tu suscripción? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                No, mantener
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
