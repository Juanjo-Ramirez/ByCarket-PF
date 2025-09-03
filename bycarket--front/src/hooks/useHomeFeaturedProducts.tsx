"use client";

import { useState, useEffect } from "react";
import { getPosts } from "@/services/vehicle.service";
import { PostResponse } from "@/services/vehicle.service";

export const useHomeFeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await getPosts(1, 20);
        if (response && response.data && response.data.length > 0) {
          const shuffledProducts = [...response.data].sort(
            () => Math.random() - 0.5
          );
          const randomProducts = shuffledProducts.slice(0, 5);
          setFeaturedProducts(randomProducts);
        } else {
          setFeaturedProducts([]);
        }
      } catch (err) {
        setError("Error al cargar los productos destacados");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);
  return { featuredProducts, loading, error };
};
