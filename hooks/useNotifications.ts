/**
 * Custom hook for using notifications in components
 */

import { notificationService } from '@/services/notification.service';
import { NotificationConfig, NotificationData } from '@/types/notification.types';
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

  const sendNotification = async (
    data: NotificationData,
    config?: NotificationConfig
  ) => {
    return notificationService.sendNotification(data, config);
  };

  const scheduleNotification = async (
    data: NotificationData,
    triggerSeconds: number,
    config?: NotificationConfig
  ) => {
    return notificationService.scheduleNotification(data, triggerSeconds, config);
  };

  const cancelNotification = async (notificationId: string) => {
    return notificationService.cancelNotification(notificationId);
  };

  const cancelAllNotifications = async () => {
    return notificationService.cancelAllNotifications();
  };

  const setBadgeCount = async (count: number) => {
    return notificationService.setBadgeCount(count);
  };

  const clearBadge = async () => {
    return notificationService.clearBadge();
  };

  // Convenience methods
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
    sendNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    setBadgeCount,
    clearBadge,
    // Convenience methods
    notifyOrderPlaced,
    notifyOrderDelivered,
    notifyOrderCancelled,
  };
};
