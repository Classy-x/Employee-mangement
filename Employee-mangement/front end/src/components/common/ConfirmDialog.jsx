import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Employee',
  message,
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={isDeleting ? () => {} : onClose} maxWidth="max-w-md">
      <div className="relative">
        {isDeleting && (
          <div className="absolute inset-0 -m-6 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-20 rounded-xl">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-red-600 rounded-full animate-spin mb-2" />
            <span className="text-sm font-medium text-gray-700">Deleting employee...</span>
          </div>
        )}

        <div className="flex flex-col items-center text-center py-2">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50/50">
            <AlertTriangle size={24} />
          </div>

          <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            {message || (
              <>
                Are you sure you want to remove <span className="font-semibold text-gray-900">{itemName}</span>?
                This action cannot be undone.
              </>
            )}
          </p>

          <div className="flex items-center gap-3 w-full">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={isDeleting}
            >
              {cancelText}
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={onConfirm}
              loading={isDeleting}
            >
              {isDeleting ? 'Deleting...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
