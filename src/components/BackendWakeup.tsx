'use client';

import { useEffect } from 'react';
import { wakeUpBackend } from '@/lib/api';

export default function BackendWakeup() {
  useEffect(() => {
    // Try to wake up the backend when the app loads
    const initBackend = async () => {
      await wakeUpBackend();
    };
    
    initBackend();
  }, []);

  // This component doesn't render anything
  return null;
} 