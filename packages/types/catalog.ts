// packages/types/catalog.ts

export type CatalogProduct = {
  product_id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;

  assigned: boolean;

  store_price?: number;
  quantity?: number;
  status?: number;
};