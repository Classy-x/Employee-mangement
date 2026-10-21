import React from 'react';
import { SearchX, Users } from 'lucide-react';
import { Button } from '../common/Button';

export const EmptyState = ({
  isFilterActive,
  onClearFilters,
  onAddEmployee
}) => {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center flex flex-col items-center justify-center my-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
        {isFilterActive ? <SearchX size={24} /> : <Users size={24} />}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1">
        {isFilterActive ? 'No matching employees' : 'No employees yet'}
      </h3>

      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {isFilterActive
          ? 'No employees match your search or filter. Try clearing your search.'
          : 'Your directory is currently empty. Get started by adding your first employee.'}
      </p>

      {isFilterActive ? (
        <Button variant="secondary" onClick={onClearFilters}>
          Clear Search
        </Button>
      ) : (
        <Button variant="primary" onClick={onAddEmployee}>
          Add Employee
        </Button>
      )}
    </div>
  );
};
