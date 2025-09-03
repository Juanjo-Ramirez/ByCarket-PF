"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getUsers, UserData } from "@/services/api.service";
import UserListHeader from "./admin/userlist/UserListHeader";
import UserSearchbar from "./admin/userlist/UserSearchbar";
import UserList from "./admin/userlist/UserList";
import StatusFilterTabs from "./admin/userlist/StatusFilterTabs";
import { showError } from "@/app/utils/Notifications";
import { useSpinner } from "@/context/SpinnerContext";

const UserListContent = () => {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const itemsPerPage = 9;
  const { setLoading: setGlobalLoading } = useSpinner();

  const fetchUsers = async () => {
    setLoading(true);
    setGlobalLoading(true);
    setError(null);
    try {
      const response = await getUsers(1, 100);
      setAllUsers(response.data);
      setFilteredUsers(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
    } catch (err) {
      const errorMessage = "Error al cargar los usuarios";
      setError(errorMessage);
      showError(errorMessage);
      setAllUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(allUsers);
      setPage(1);
      setTotalPages(Math.ceil(allUsers.length / itemsPerPage));
      return;
    }

    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
    setPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [searchQuery, allUsers, statusFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilterChange = useCallback((filter: string | null) => {
    setStatusFilter(filter);
    setPage(1);
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...allUsers];

    if (searchQuery.trim() !== "") {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((user) =>
        statusFilter === "active" ? user.isActive : !user.isActive
      );
    }

    return result;
  }, [allUsers, searchQuery, statusFilter]);

  useEffect(() => {
    const filtered = applyFilters();
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [applyFilters, itemsPerPage]);

  const getPaginatedUsers = () => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedUsers = getPaginatedUsers();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <UserListHeader />

      <div className="mb-8">
        <UserSearchbar onSearch={handleSearch} />
        <StatusFilterTabs
          activeFilter={statusFilter}
          onFilterChange={handleStatusFilterChange}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          <UserList users={paginatedUsers} onRefresh={fetchUsers} />

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>

                <div className="flex items-center justify-center px-4">
                  <span className="text-gray-600">
                    Página {page} de {totalPages}
                  </span>
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                  disabled={page === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserListContent;
