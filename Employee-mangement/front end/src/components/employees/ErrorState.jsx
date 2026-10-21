import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from '../common/Button';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-10 text-center flex flex-col items-center justify-center my-4 shadow-xs" role="alert">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50/50">
        <AlertOctagon size={24} />
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load employees</h3>

      <p className="text-sm text-red-600 max-w-md mb-6">
        {message || 'An error occurred while loading records.'}
      </p>

      <Button variant="primary" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
};
