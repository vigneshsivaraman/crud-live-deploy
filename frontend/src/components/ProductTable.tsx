import React from 'react';
import { Product } from '../types/product';
import { Edit2, Trash2, ArrowUpDown, Plus, Minus } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateStock: (product: Product, newStock: number) => void;
  onSort: (field: string) => void;
  sortBy: string;
  order: 'ASC' | 'DESC';
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onUpdateStock,
  onSort,
  sortBy,
  order,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Out of Stock':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />;
    }
    return (
      <span className="text-blue-600 font-bold text-xs ml-1">
        {order === 'ASC' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th
                onClick={() => onSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 group"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Product</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th
                onClick={() => onSort('category')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 group"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Category</span>
                  {renderSortIndicator('category')}
                </div>
              </th>
              <th
                onClick={() => onSort('price')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 group"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Price</span>
                  {renderSortIndicator('price')}
                </div>
              </th>
              <th
                onClick={() => onSort('stock')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 group"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Stock</span>
                  {renderSortIndicator('stock')}
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No products found matching the criteria.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Name & SKU */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      SKU: {product.sku}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  {/* Stock counter */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          onClick={() =>
                            onUpdateStock(product, Math.max(0, product.stock - 1))
                          }
                          disabled={product.stock <= 0}
                          className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 disabled:opacity-40"
                          title="Decrease stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-800 min-w-[20px] text-center">
                          {product.stock}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateStock(product, product.stock + 1)
                          }
                          className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900"
                          title="Increase stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(
                        product.status,
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
