'use client';

import { ReactNode } from 'react';
import toast from 'react-hot-toast';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  type?: NotificationType;
}

const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-800';
    case 'error':
      return 'bg-red-50 text-red-800';
    case 'warning':
      return 'bg-yellow-50 text-yellow-800';
    case 'info':
    default:
      return 'bg-blue-50 text-blue-800';
  }
};

export const showNotification = ({ message, type = 'info' }: NotificationProps) => {
  return toast.custom(
    <div className={`${getNotificationStyles(type)} px-4 py-2 rounded-md shadow-sm`}>
      {message}
    </div>
  );
}; 
 