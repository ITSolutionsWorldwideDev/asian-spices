// apps/web/components/layout/products/InfiniteProducts.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function InfiniteProducts({ initialProducts, filters }: any) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(2);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { show, hide } = useLoaderStore();

  const observerRef = useRef<HTMLDivElement | null>(null);

  const limit = 12;

  const buildParams = (filters: any, page: number) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        }
      } else {
        params.set(key, String(value));
      }
    });

    params.set("page", String(page));

    return params.toString();
  };

  const fetchMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      show("Loading Products...");

      const query = buildParams(filters, page);

      const res = await fetch(`/api/products?${query}`);
      const data = await res.json();

      const newProducts = data.data || [];

      setProducts((prev: any) => {
        const map = new Map();

        [...prev, ...newProducts].forEach((p) => {
          map.set(p.id, p); // ensures unique by id
        });

        return Array.from(map.values());
      });

      if (newProducts.length < limit) {
        setHasMore(false);
      }

      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
      hide();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && !loading && hasMore) {
          fetchMore();
        }
      },
      {
        threshold: 1.0,
      },
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loading, hasMore, page]);

  useEffect(() => {
    setProducts(initialProducts);
    setPage(2);
    setHasMore(true);
  }, [initialProducts]);

  return (
    <>
      <ProductCard products={products} />

      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <p>Loading...</p>}
        </div>
      )}

      {!hasMore && (
        <p className="text-center py-6 text-gray-500">No more products</p>
      )}
    </>
  );
}
