// apps/web/components/layout/product_filter_search/SortDropdown.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const params = useSearchParams();

  const handleChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("sort", value);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <select
      onChange={(e) => handleChange(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price Low → High</option>
      <option value="price_desc">Price High → Low</option>
      <option value="popular">Popular</option>
      <option value="relevance">Relevance</option>
    </select>
  );
}