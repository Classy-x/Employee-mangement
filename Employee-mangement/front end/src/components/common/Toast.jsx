import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { type = 'success', message } = toast;

  const getStyle = () => {
    if (type === 'error') {
      return {
        card: 'bg-white border-red-200 text-red-900 border-l-4 border-l-red-500',
        icon: <AlertCircle size={18} className="text-red-500 shrink-0" />
      };
    }
    return {
      card: 'bg-white border-emerald-200 text-emerald-900 border-l-4 border-l-emerald-500',
      icon: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
    };
  };

  const style = getStyle();

  return (
    <div
      className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border shadow-lg max-w-sm pointer-events-auto transition-all ${style.card}`}
      role="status"
    >
      <div className="flex items-center gap-2.5">
        {style.icon}
        <span className="text-sm font-medium text-gray-800">{message}</span>
      </div>
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors cursor-pointer"
        onClick={onClose}
        aria-label="Dismiss message"
      >
        <X size={14} />
      </button>
    </div>
  );
};
