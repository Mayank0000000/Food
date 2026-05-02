
export enum NotificationType {
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_PREPARING = 'order_preparing',
  ORDER_OUT_FOR_DELIVERY = 'order_out_for_delivery',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_CANCELLED = 'booking_cancelled',
  PROMOTION = 'promotion',
}

export interface NotificationData {
  type: NotificationType;
  orderId?: string;
  bookingId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationConfig {
  sound?: boolean;
  vibrate?: boolean;
  badge?: boolean;
  priority?: 'default' | 'high' | 'low';
}

export interface ScheduledNotification {
  id: string;
  trigger: Date | number; // Date or seconds from now
  content: NotificationData;
}
