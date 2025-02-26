'use client';

import { Fragment, useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export function Notification({
  type = 'info',
  title,
  message,
  show,
  onClose,
  duration = 5000,
}: NotificationProps): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getIcon = (): JSX.Element => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />;
    }
  };

  const getBgColor = (): string => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getBorderColor = (): string => {
    switch (type) {
      case 'success':
        return 'border-green-400';
      case 'error':
        return 'border-red-400';
      case 'warning':
        return 'border-yellow-400';
      case 'info':
      default:
        return 'border-blue-400';
    }
  };

  const getTextColor = (): string => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  const handleClose = (): void => {
    setIsVisible(false);
    onClose();
  };

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={isVisible}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border ${getBorderColor()} shadow-lg ring-1 ring-black ring-opacity-5 ${getBgColor()}`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className={`text-sm font-medium ${getTextColor()}`}>{title}</p>
                  <p className={`mt-1 text-sm ${getTextColor()}`}>{message}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className={`inline-flex rounded-md ${getTextColor()} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
