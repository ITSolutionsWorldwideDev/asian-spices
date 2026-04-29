// apps/web/components/layout/products/InfiniteProducts.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";

export default function InfiniteProducts({ initialProducts, filters }: any) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(2);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const limit = 12; // must match backend

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
      const query = buildParams(filters, page);

      const res = await fetch(`/api/products?${query}`);
      const data = await res.json();

      const newProducts = data.data || [];

      // setProducts((prev: any) => [...prev, ...newProducts]);
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

  // 🔥 RESET WHEN FILTER CHANGES
  useEffect(() => {
    setProducts(initialProducts);
    setPage(2);
    setHasMore(true);
  }, [initialProducts]);

  return (
    <>
      <ProductCard products={products} />

      {/* LOADER SENTINEL */}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <p>Loading...</p>}
        </div>
      )}

      {/* 🔥 STOP MESSAGE */}
      {!hasMore && (
        <p className="text-center py-6 text-gray-500">No more products</p>
      )}
      {/* <div id="load-more" className="h-10 flex justify-center items-center">
        {loading && <span>Loading...</span>}
      </div> */}
    </>
  );
}

/* const fetchMore = async () => {
    if (loading || !hasMore) return; // 🔥 STOP CONDITIONS

    setLoading(true);

    const params = new URLSearchParams(filters);

    
    params.set("page", page.toString());

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    const newProducts = data.data || [];

    // 🔥 APPEND
    setProducts((prev: any) => [...prev, ...newProducts]);

    // 🔥 STOP LOGIC (CRITICAL)
    if (newProducts.length < limit) {
      setHasMore(false);
    }

    setPage((prev) => prev + 1);
    setLoading(false);
  }; */

/* const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasMore
        ) {
          fetchMore();
        }
      },
      {
        threshold: 1.0,
      }
    ); */

/* useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (entry.isIntersecting && !loading) {
        loadMore();
      }
    });

    const el = document.getElementById("load-more");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [page, loading]); */

/* const loadMore = async () => {
    setLoading(true);

    const nextPage = page + 1;

    

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length) params.set(key, value.join(","));
      } else if (value) {
        params.set(key, String(value));
      }
    });

    params.set("page", String(nextPage));

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();

    setProducts((prev: any) => [...prev, ...data]);
    setPage(nextPage);
    setLoading(false);
  }; */

/* useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          loadMore();
          break;
        }
      }
    });

    const el = document.getElementById("load-more");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [page]); */

/* const loadMore = async () => {
    const nextPage = page + 1;

    const params = new URLSearchParams({
      ...filters,
      page: String(nextPage),
    });

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();

    setProducts((prev: any) => [...prev, ...data]);
    setPage(nextPage);
  }; */
