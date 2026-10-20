export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status?: ProductStatus;
  sku?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductStats {
  totalProducts: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  inStockCount: number;
  categories: string[];
}
