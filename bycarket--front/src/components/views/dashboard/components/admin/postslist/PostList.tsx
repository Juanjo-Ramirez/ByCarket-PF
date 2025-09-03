"use client";

import React, { useState, useEffect } from "react";
import { getPendingPosts, PostResponse } from "@/services/vehicle.service";
import PostCard from "./PostCard";
import OrderPostBy from "./OrderPostBy";
import PostDetail from "./PostDetail";

const ITEMS_PER_PAGE = 10;

const PostList = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPendingPosts({
        limit: ITEMS_PER_PAGE,
        page: currentPage,
      });
      const postsData = Array.isArray(response.data) ? response.data : [];
      setPosts(postsData);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || response.total || postsData.length);
    } catch {
      setPosts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, orderBy]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOrderChange = (order: "asc" | "desc") => {
    setOrderBy(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetail = (post: PostResponse) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  const handleActionSuccess = () => {
    fetchPosts();
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <OrderPostBy onOrderChange={handleOrderChange} currentOrder={orderBy} />
      </div>

      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600">
            No hay posts pendientes
          </h3>
          <p className="text-gray-500 mt-2">
            Todos los posts han sido procesados
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-principal-blue hover:bg-gray-100"
                  }`}
                >
                  <span className="sr-only">Página anterior</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded ${
                        currentPage === page
                          ? "bg-secondary-blue text-white"
                          : "text-principal-blue hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-principal-blue hover:bg-gray-100"
                  }`}
                >
                  <span className="sr-only">Página siguiente</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={handleCloseDetail}
          onActionSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};

export default PostList;
