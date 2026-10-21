import React from 'react';

export const FormField = ({
  label,
  id,
  error,
  required = false,
  helperText,
  children
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {children}
      </div>
      {error ? (
        <span className="text-xs font-medium text-red-600 mt-0.5" role="alert">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500">{helperText}</span>
      ) : null}
    </div>
  );
};
