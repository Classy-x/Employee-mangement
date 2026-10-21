import React from 'react';
import { Search, X } from 'lucide-react';

export const EmployeeFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  stats
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'All', count: stats.total },
    { value: 'Active', label: 'Active', count: stats.active },
    { value: 'Inactive', label: 'Inactive', count: stats.inactive }
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          id="employee-search-input"
          type="text"
          className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder="Search employees by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200/60 self-start sm:self-auto">
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => onStatusChange(opt.value)}
            >
              <span>{opt.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                  isActive ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
