import React from 'react';
import { ProductStats } from '../types/product';
import { Box, DollarSign, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  stats: ProductStats | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Products',
      value: stats ? stats.totalProducts.toString() : '-',
      icon: Box,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      badge: `${stats ? stats.categories.length : 0} categories`,
    },
    {
      title: 'Inventory Value',
      value: stats
        ? `$${stats.totalInventoryValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : '-',
      icon: DollarSign,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      badge: 'Current valuation',
    },
    {
      title: 'Low Stock Alert',
      value: stats ? stats.lowStockCount.toString() : '-',
      icon: AlertTriangle,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      badge: '≤ 10 items remaining',
    },
    {
      title: 'Out of Stock',
      value: stats ? stats.outOfStockCount.toString() : '-',
      icon: AlertCircle,
      color: 'rose',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      badge: 'Requires reorder',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{card.title}</span>
              <div className={`p-2 rounded-xl ${card.bgColor} ${card.textColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
