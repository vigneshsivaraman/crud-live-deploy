import React from 'react';
import { Package, Database, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface NavbarProps {
  onRefresh: () => void;
  onSeed: () => void;
  isSeeding: boolean;
  isRefreshing: boolean;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRefresh,
  onSeed,
  isSeeding,
  isRefreshing,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Stock<span className="text-blue-600">Flow</span>
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                CRUD App
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              React + NestJS + PostgreSQL
            </p>
          </div>
        </div>

        {/* Stack Badges & Quick Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100/80 text-xs font-medium text-slate-600 border border-slate-200/80">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PostgreSQL 17</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>NestJS</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>React</span>
            </div>
          </div>

          <button
            onClick={onSeed}
            disabled={isSeeding}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all duration-150 disabled:opacity-50"
            title="Seed demo catalog items"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isSeeding ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Seed Demo Data</span>
            <span className="sm:hidden">Seed</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all duration-150 disabled:opacity-50"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
