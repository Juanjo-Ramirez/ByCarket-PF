"use client";

import React from "react";
import { UserData } from "@/services/api.service";
import UserActions from "./UserActions";
import UserDetails from "./UserDetails";
import { FaUser } from "react-icons/fa";

interface UsersCardProps {
  user: UserData;
  onActionComplete: () => void;
}

const UsersCard = ({ user, onActionComplete }: UsersCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-principal-blue text-white shadow-md">
            {getInitials(user.name) || <FaUser />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {user.name}
              </h3>
              <div
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  user.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              {user.role === "admin" && (
                <span className="text-red-600 font-medium">Admin</span>
              )}
              {user.role === "premium" && (
                <span className="text-principal-blue font-medium">Premium</span>
              )}
              {user.role === "user" && (
                <span className="text-gray-600">Usuario</span>
              )}
            </p>
          </div>
        </div>

        <UserDetails user={user} />

        <div className="mt-4">
          <UserActions userId={user.id} onActionComplete={onActionComplete} />
        </div>
      </div>
    </div>
  );
};

export default UsersCard;
