'use client';

import { Dialog } from '@/components/ui/Dialog';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: 'primary' | 'danger' | 'warning';
  icon?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonType = 'danger',
  icon = true,
}: ConfirmationDialogProps): JSX.Element {
  const handleConfirm = (): void => {
    onConfirm();
    onClose();
  };

  const buttonClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      <div className="sm:flex sm:items-start">
        {icon && (
          <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
            confirmButtonType === 'danger' ? 'bg-red-100 dark:bg-red-900/20' : 
            confirmButtonType === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 
            'bg-primary-100 dark:bg-primary-900/20'
          } sm:mx-0 sm:h-10 sm:w-10`}>
            <ExclamationTriangleIcon 
              className={`h-6 w-6 ${
                confirmButtonType === 'danger' ? 'text-red-600 dark:text-red-400' : 
                confirmButtonType === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-primary-600 dark:text-primary-400'
              }`} 
              aria-hidden="true" 
            />
          </div>
        )}
        <div className={`mt-3 text-center ${icon ? 'sm:ml-4 sm:mt-0 sm:text-left' : ''}`}>
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${buttonClasses[confirmButtonType]}`}
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={onClose}
        >
          {cancelText}
        </button>
      </div>
    </Dialog>
  );
}
