"use client";

import React, { useState } from "react";
import { UserData } from "@/services/api.service";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface UserDetailsProps {
  user: UserData;
}

const UserDetails = ({ user }: UserDetailsProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatPhoneNumber = (phone?: number) => {
    if (!phone) return "No especificado";
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(
        3,
        6
      )}-${phoneStr.slice(6)}`;
    }
    return phoneStr;
  };

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-principal-blue transition-colors"
      >
        <span className="font-medium">Detalles del usuario</span>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {expanded && (
        <div className="bg-gray-50 p-4 rounded-md mt-2 space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <FaEnvelope className="text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Email</p>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaPhone className="text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Teléfono</p>
              <p>{formatPhoneNumber(user.phone)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Ubicación</p>
              <p>
                {user.city || "No especificado"}
                {user.city && user.country ? ", " : ""}
                {user.country || ""}
              </p>
              <p>{user.address || "Sin dirección"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
