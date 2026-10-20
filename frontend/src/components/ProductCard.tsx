import React from 'react';
import { Product } from '../types/product';
import { Edit2, Trash2, Plus, Minus, Tag, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateStock: (product: Product, newStock: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Tag className="w-3 h-3 text-slate-500" />
            <span>{product.category}</span>
          </span>

          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(
              product.status,
            )}`}
          >
            {product.status}
          </span>
        </div>

        {/* Product Title & SKU */}
        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-xs font-mono text-slate-400 mb-2">SKU: {product.sku}</p>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mb-4">
          {product.description || 'No description provided.'}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100">
        {/* Price & Stock info */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-xs text-slate-400 block">Unit Price</span>
            <span className="text-xl font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">In Stock</span>
            <span className="text-sm font-semibold text-slate-800">
              {product.stock} units
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          {/* Quick stock +/- buttons */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onUpdateStock(product, Math.max(0, product.stock - 1))}
              disabled={product.stock <= 0}
              title="Decrease stock by 1"
              className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-medium text-slate-700 min-w-[20px] text-center">
              {product.stock}
            </span>
            <button
              onClick={() => onUpdateStock(product, product.stock + 1)}
              title="Increase stock by 1"
              className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Edit / Delete action buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
              title="Edit product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
