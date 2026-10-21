import React from 'react';

export const LoadingSpinner = ({ message = 'Loading employees...' }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center my-4 shadow-xs">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-3" />
      <span className="text-sm font-medium text-gray-500">{message}</span>
    </div>
  );
};
