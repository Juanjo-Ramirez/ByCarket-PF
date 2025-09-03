"use client";

import React from "react";
import { UserData } from "@/services/api.service";
import UsersCard from "./UsersCard";

interface UserListProps {
  users: UserData[];
  onRefresh: () => void;
}

const UserList = ({ users, onRefresh }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {users.map((user) => (
        <UsersCard 
          key={user.id} 
          user={user} 
          onActionComplete={onRefresh} 
        />
      ))}
    </div>
  );
};

export default UserList;
