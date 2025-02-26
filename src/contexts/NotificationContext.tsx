'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, NotificationType } from '@/components/ui/Notification';

interface NotificationContextProps {
  showNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
  hideNotification: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

interface NotificationState {
  type: NotificationType;
  title: string;
  message: string;
  show: boolean;
  duration: number;
}

const defaultNotificationState: NotificationState = {
  type: 'info',
  title: '',
  message: '',
  show: false,
  duration: 5000,
};

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: NotificationProviderProps): JSX.Element {
  const [notification, setNotification] = useState<NotificationState>(defaultNotificationState);

  const showNotification = (
    type: NotificationType, 
    title: string, 
    message: string, 
    duration = 5000
  ): void => {
    setNotification({
      type,
      title,
      message,
      show: true,
      duration,
    });
  };

  const hideNotification = (): void => {
    setNotification((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
      }}
    >
      {children}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        show={notification.show}
        onClose={hideNotification}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextProps {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
}
