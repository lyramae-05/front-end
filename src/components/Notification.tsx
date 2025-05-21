'use client';

import { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

let showNotificationFn: (props: NotificationProps) => void = () => {};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    showNotificationFn = (props: NotificationProps) => {
      setNotifications(prev => [...prev, props]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n !== props));
      }, props.duration || 4000);
    };
  }, []);

  const getNotificationStyles = (type: NotificationProps['type'] = 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-md shadow-sm border ${getNotificationStyles(notification.type)}`}
          >
            {notification.message}
          </div>
        ))}
      </div>
      {children}
    </>
  );
}

export const showNotification = (props: NotificationProps) => {
  showNotificationFn(props);
}; 
 