import axios from 'axios';
import { Product, CreateProductInput, UpdateProductInput, ProductStats } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getProducts: async (params?: {
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }): Promise<{ products: Product[]; total: number }> => {
    const res = await client.get('/products', { params });
    return res.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await client.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (data: CreateProductInput): Promise<Product> => {
    const res = await client.post('/products', data);
    return res.data;
  },

  updateProduct: async (id: number, data: UpdateProductInput): Promise<Product> => {
    const res = await client.patch(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: number): Promise<{ message: string; id: number }> => {
    const res = await client.delete(`/products/${id}`);
    return res.data;
  },

  getStats: async (): Promise<ProductStats> => {
    const res = await client.get('/products/stats');
    return res.data;
  },

  seedProducts: async (): Promise<{ message: string; count: number }> => {
    const res = await client.post('/products/seed');
    return res.data;
  },
};
