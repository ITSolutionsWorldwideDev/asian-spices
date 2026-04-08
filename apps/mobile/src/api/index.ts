// src/api/index.ts
export const getStores = async () => [
  { id: "store1", name: "Tech Store", description: "Electronics and gadgets" },
  { id: "store2", name: "Fashion Store", description: "Clothing and accessories" },
];

export const getCategories = async () => [
  { id: "cat1", name: "Electronics" },
  { id: "cat2", name: "Fashion" },
];

export const getProductsByStore = async (storeId: string) => [
  { id: storeId + "-prod1", storeId, name: "Product A", price: 19.99 },
  { id: storeId + "-prod2", storeId, name: "Product B", price: 29.99 },
];

export const getProductsByCategory = async (categoryId: string) => [
  { id: categoryId + "-prod1", storeId: "store1", name: "Category Product 1", price: 15.99 },
  { id: categoryId + "-prod2", storeId: "store2", name: "Category Product 2", price: 25.99 },
];