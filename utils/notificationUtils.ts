/**
 * Notification utility functions
 */

import { NotificationType } from '@/types/notification.types';

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.ORDER_PLACED:
      return '🎉';
    case NotificationType.ORDER_CONFIRMED:
      return '✅';
    case NotificationType.ORDER_PREPARING:
      return '👨‍🍳';
    case NotificationType.ORDER_OUT_FOR_DELIVERY:
      return '🚗';
    case NotificationType.ORDER_DELIVERED:
      return '✅';
    case NotificationType.ORDER_CANCELLED:
      return '❌';
    case NotificationType.BOOKING_CONFIRMED:
      return '🎊';
    case NotificationType.BOOKING_REMINDER:
      return '⏰';
    case NotificationType.BOOKING_CANCELLED:
      return '❌';
    case NotificationType.PROMOTION:
      return '🎁';
    default:
      return '🔔';
  }
};

/**
 * Format notification title based on type
 */
export const formatNotificationTitle = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.ORDER_PLACED:
      return 'Order Placed!';
    case NotificationType.ORDER_CONFIRMED:
      return 'Order Confirmed!';
    case NotificationType.ORDER_PREPARING:
      return 'Order Being Prepared';
    case NotificationType.ORDER_OUT_FOR_DELIVERY:
      return 'Order Out for Delivery';
    case NotificationType.ORDER_DELIVERED:
      return 'Order Delivered!';
    case NotificationType.ORDER_CANCELLED:
      return 'Order Cancelled';
    case NotificationType.BOOKING_CONFIRMED:
      return 'Booking Confirmed!';
    case NotificationType.BOOKING_REMINDER:
      return 'Booking Reminder';
    case NotificationType.BOOKING_CANCELLED:
      return 'Booking Cancelled';
    case NotificationType.PROMOTION:
      return 'Special Offer!';
    default:
      return 'Notification';
  }
};

/**
 * Check if notification type is high priority
 */
export const isHighPriority = (type: NotificationType): boolean => {
  return [
    NotificationType.ORDER_PLACED,
    NotificationType.ORDER_DELIVERED,
    NotificationType.ORDER_CANCELLED,
    NotificationType.ORDER_OUT_FOR_DELIVERY,
    NotificationType.BOOKING_CONFIRMED,
    NotificationType.BOOKING_REMINDER,
  ].includes(type);
};

/**
 * Get Ionicon name based on notification history type
 */
export const getNotificationHistoryIcon = (type: string): string => {
  switch (type) {
    case 'order':
      return 'receipt';
    case 'booking':
      return 'restaurant';
    case 'promotion':
      return 'pricetag';
    default:
      return 'notifications';
  }
};

/**
 * Get icon color based on notification history type
 */
export const getNotificationHistoryIconColor = (type: string): string => {
  switch (type) {
    case 'order':
      return '#FF6B35';
    case 'booking':
      return '#4CAF50';
    case 'promotion':
      return '#FFD700';
    default:
      return '#666';
  }
};

/**
 * Format notification timestamp to relative time
 */
export const formatNotificationTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Clean corrupted emoji characters from notification titles
 */
export const cleanNotificationTitle = (title: string, type: string): string => {
  let cleanTitle = title;
  
  // Fix common corrupted emoji patterns
  if (cleanTitle.includes('ð') || cleanTitle.includes('Ã°')) {
    // Remove corrupted emoji characters
    cleanTitle = cleanTitle.replace(/[ðÃ°Â]+/g, '').trim();
    
    // Add proper text based on notification type
    if (type === 'order') {
      if (cleanTitle.includes('Placed')) {
        cleanTitle = 'Order Placed!';
      } else if (cleanTitle.includes('Delivered')) {
        cleanTitle = 'Order Delivered!';
      } else if (cleanTitle.includes('Cancelled')) {
        cleanTitle = 'Order Cancelled';
      }
    }
  }
  
  return cleanTitle;
};
