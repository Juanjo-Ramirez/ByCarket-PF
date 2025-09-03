import React from "react";
import { Crown, CheckCircle } from "lucide-react";

export default function PremiumHeader() {
  return (
    <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl md:text-4xl font-bold">Premium Active</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Potencia tus ventas con inteligencia artificial
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Estado: Activa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
