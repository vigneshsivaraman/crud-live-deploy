import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  RefreshCw,
  PackageX,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { DeleteModal } from './components/DeleteModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { productApi } from './services/api';
import {
  Product,
  ProductStats,
  CreateProductInput,
  UpdateProductInput,
} from './types/product';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch products & stats
  const loadData = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const [productsRes, statsRes] = await Promise.all([
        productApi.getProducts({
          search: searchQuery,
          category: selectedCategory,
          status: selectedStatus,
          sortBy,
          order,
        }),
        productApi.getStats(),
      ]);

      setProducts(productsRes.products || []);
      setStats(statsRes);
    } catch (err: any) {
      console.error('Failed to load products', err);
      addToast(
        'error',
        'Unable to connect to backend API. Please make sure the NestJS server is running.',
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, order]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Seed sample data
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await productApi.seedProducts();
      addToast('success', res.message || 'Sample products loaded!');
      await loadData();
    } catch (err: any) {
      addToast('error', 'Failed to seed sample products.');
    } finally {
      setIsSeeding(false);
    }
  };

  // Create or Update Product
  const handleFormSubmit = async (
    data: CreateProductInput | UpdateProductInput,
  ) => {
    if (productToEdit) {
      await productApi.updateProduct(productToEdit.id, data);
      addToast('success', `Product "${data.name}" updated successfully!`);
    } else {
      await productApi.createProduct(data as CreateProductInput);
      addToast('success', `Product "${data.name}" registered successfully!`);
    }
    await loadData();
  };

  // Quick Stock Adjustment
  const handleUpdateStock = async (product: Product, newStock: number) => {
    try {
      await productApi.updateProduct(product.id, { stock: newStock });
      addToast(
        'info',
        `Stock for ${product.name} updated to ${newStock} units.`,
      );
      await loadData();
    } catch (err) {
      addToast('error', 'Failed to update stock.');
    }
  };

  // Delete Product
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productApi.deleteProduct(productToDelete.id);
      addToast('success', `Product "${productToDelete.name}" deleted.`);
      await loadData();
    } catch (err) {
      addToast('error', 'Failed to delete product.');
    }
  };

  // Sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
  };

  const categories = stats ? stats.categories : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        onRefresh={() => loadData(true)}
        onSeed={handleSeed}
        isSeeding={isSeeding}
        isRefreshing={isRefreshing}
        totalCount={products.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Dashboard Metrics */}
        <StatsOverview stats={stats} />

        {/* Toolbar & Filter Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, SKU, description..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dropdown Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 transition"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 transition"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => {
                setProductToEdit(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">
              Connecting to PostgreSQL & loading items...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No products found
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'Try adjusting your search criteria or resetting the active filters.'
                : 'Your database is currently empty. Add your first item or load demo catalog data.'}
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Load Sample Data
              </button>
              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
              >
                Add New Product
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(p) => {
                  setProductToEdit(p);
                  setIsModalOpen(true);
                }}
                onDelete={(p) => {
                  setProductToDelete(p);
                  setIsDeleteModalOpen(true);
                }}
                onUpdateStock={handleUpdateStock}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={(p) => {
              setProductToEdit(p);
              setIsModalOpen(true);
            }}
            onDelete={(p) => {
              setProductToDelete(p);
              setIsDeleteModalOpen(true);
            }}
            onUpdateStock={handleUpdateStock}
            onSort={handleSort}
            sortBy={sortBy}
            order={order}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          Fullstack CRUD Application • React 18 + Vite • NestJS 10 + TypeORM • PostgreSQL 17
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        productToEdit={productToEdit}
        existingCategories={categories}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        product={productToDelete}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
