import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Product } from '../types/product';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  product: Product | null;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Product</h3>
          <p className="text-sm text-slate-600 mb-4">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-900">"{product.name}"</span>?
            This operation will permanently remove the record from PostgreSQL and cannot be undone.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1 mb-6">
            <div className="flex justify-between text-slate-500">
              <span>SKU:</span>
              <span className="font-mono text-slate-700">{product.sku}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Category:</span>
              <span className="text-slate-700">{product.category}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Stock:</span>
              <span className="text-slate-700">{product.stock} units</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
