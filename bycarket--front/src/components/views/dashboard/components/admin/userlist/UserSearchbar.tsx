"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface UserSearchbarProps {
  onSearch: (query: string) => void;
}

const UserSearchbar = ({ onSearch }: UserSearchbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre de usuario"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-principal-blue"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-principal-blue text-white rounded-r-md hover:bg-secondary-blue transition-colors"
        >
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default UserSearchbar;
