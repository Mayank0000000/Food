/**
 * Custom hook for using notifications in components
 */

import { notificationService } from '@/services/notification.service';
import { useEffect } from 'react';

export const useNotifications = () => {
  useEffect(() => {
    // Initialize notification service
    notificationService.initialize();

    // Cleanup on unmount
    return () => {
      notificationService.cleanup();
    };
  }, []);

  // Convenience methods for order notifications
  const notifyOrderPlaced = async (orderId: string, restaurantName: string) => {
    return notificationService.notifyOrderPlaced(orderId, restaurantName);
  };

  const notifyOrderDelivered = async (orderId: string) => {
    return notificationService.notifyOrderDelivered(orderId);
  };

  const notifyOrderCancelled = async (orderId: string, reason?: string) => {
    return notificationService.notifyOrderCancelled(orderId, reason);
  };

  return {
    notifyOrderPlaced,
    notifyOrderDelivered,
    notifyOrderCancelled,
  };
};
