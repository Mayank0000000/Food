

import { NotificationConfig, NotificationData, NotificationType } from '@/types/notification.types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;
  private currentUserId: string | null = null;

  /**
   * Initialize notification service
   */
  async initialize(userId?: string) {
    if (userId) {
      this.currentUserId = userId;
    }
    await this.requestPermissions();
    this.setupListeners();
    
    if (Platform.OS === 'android') {
      await this.setupAndroidChannels();
    }
  }

  /**
   * Set current user ID for saving notifications
   */
  setUserId(userId: string) {
    this.currentUserId = userId;
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Setup Android notification channels
   */
  private async setupAndroidChannels() {
    if (Platform.OS !== 'android') return;

    // Orders channel
    await Notifications.setNotificationChannelAsync('orders', {
      name: 'Order Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });

    // Bookings channel
    await Notifications.setNotificationChannelAsync('bookings', {
      name: 'Booking Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });

    // Promotions channel
    await Notifications.setNotificationChannelAsync('promotions', {
      name: 'Promotions & Offers',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
      showBadge: false,
    });
  }

  /**
   * Setup notification listeners
   */
  private setupListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        // Handle foreground notification
      }
    );

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        this.handleNotificationResponse(response);
      }
    );
  }

  /**
   * Handle notification tap/response
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    
    // Navigate based on notification type
    if (data.type) {
      switch (data.type) {
        case NotificationType.ORDER_PLACED:
        case NotificationType.ORDER_CONFIRMED:
        case NotificationType.ORDER_PREPARING:
        case NotificationType.ORDER_OUT_FOR_DELIVERY:
        case NotificationType.ORDER_DELIVERED:
        case NotificationType.ORDER_CANCELLED:
          // Navigate to order tracking or order details
          if (data.orderId) {
            console.log('Navigate to order:', data.orderId);
            // router.push(`/order-tracking?orderId=${data.orderId}`);
          }
          break;
        
        case NotificationType.BOOKING_CONFIRMED:
        case NotificationType.BOOKING_REMINDER:
        case NotificationType.BOOKING_CANCELLED:
          // Navigate to bookings
          console.log('Navigate to bookings');
          // router.push('/my-bookings');
          break;
      }
    }
  }

  /**
   * Send local notification immediately
   */
  async sendNotification(
    notificationData: NotificationData,
    config: NotificationConfig = {}
  ): Promise<string> {
    try {
      const channelId = this.getChannelId(notificationData.type);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: {
            type: notificationData.type,
            ...notificationData.data,
          },
          sound: config.sound !== false ? 'default' : undefined,
          badge: config.badge !== false ? 1 : undefined,
          priority: config.priority === 'high' 
            ? Notifications.AndroidNotificationPriority.HIGH 
            : Notifications.AndroidNotificationPriority.DEFAULT,
          ...(Platform.OS === 'android' && { channelId }),
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Schedule notification for later
   */
  async scheduleNotification(
    notificationData: NotificationData,
    triggerSeconds: number,
    config: NotificationConfig = {}
  ): Promise<string> {
    try {
      const channelId = this.getChannelId(notificationData.type);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: {
            type: notificationData.type,
            ...notificationData.data,
          },
          sound: config.sound !== false ? 'default' : undefined,
          badge: config.badge !== false ? 1 : undefined,
          ...(Platform.OS === 'android' && { channelId }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: triggerSeconds,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Cancel scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Clear badge count
   */
  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  /**
   * Get channel ID based on notification type
   */
  private getChannelId(type: NotificationType): string {
    if (
      type === NotificationType.ORDER_PLACED ||
      type === NotificationType.ORDER_CONFIRMED ||
      type === NotificationType.ORDER_PREPARING ||
      type === NotificationType.ORDER_OUT_FOR_DELIVERY ||
      type === NotificationType.ORDER_DELIVERED ||
      type === NotificationType.ORDER_CANCELLED
    ) {
      return 'orders';
    }

    if (
      type === NotificationType.BOOKING_CONFIRMED ||
      type === NotificationType.BOOKING_REMINDER ||
      type === NotificationType.BOOKING_CANCELLED
    ) {
      return 'bookings';
    }

    return 'promotions';
  }

  /**
   * Cleanup listeners
   */
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  // ============================================
  // Helper methods
  // ============================================

  /**
   * Save notification to history (API)
   */
  private async saveToHistory(notificationData: NotificationData) {
    if (!this.currentUserId) {
      console.log('⚠️ No user ID set, skipping notification history save');
      return;
    }

    try {
      const { notificationHistoryService } = await import('./notification-history.service');
      
      // Map notification type to history type
      let historyType: 'order' | 'booking' | 'promotion' | 'system' = 'system';
      if (notificationData.type.includes('order')) {
        historyType = 'order';
      } else if (notificationData.type.includes('booking')) {
        historyType = 'booking';
      } else if (notificationData.type === NotificationType.PROMOTION) {
        historyType = 'promotion';
      }

      await notificationHistoryService.createNotification({
        userId: this.currentUserId,
        type: historyType,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data,
      });
      
      console.log('✅ Notification saved to history');
    } catch (error) {
      // Non-critical error - just log as warning
      console.warn('⚠️ Could not save notification to history (non-critical):', error instanceof Error ? error.message : error);
    }
  }

  // ============================================
  // Convenience methods for specific notifications
  // ============================================

  /**
   * Send order placed notification
   */
  async notifyOrderPlaced(orderId: string, restaurantName: string) {
    console.log('🔔 Sending order placed notification for:', orderId);
    try {
      const result = await this.sendNotification({
        type: NotificationType.ORDER_PLACED,
        title: 'Order Placed!',
        body: `Your order from ${restaurantName} has been placed successfully.`,
        data: { orderId, restaurantName },
      });
      console.log('✅ Order placed notification sent, ID:', result);
      
      // Save to notification history (fire and forget - don't block on errors)
      this.saveToHistory({
        type: NotificationType.ORDER_PLACED,
        title: 'Order Placed!',
        body: `Your order from ${restaurantName} has been placed successfully.`,
        data: { orderId, restaurantName },
      }).catch(() => {}); // Silently ignore errors
      
      return result;
    } catch (error) {
      console.error('❌ Error sending placed notification:', error);
      throw error;
    }
  }

  /**
   * Send order delivered notification
   */
  async notifyOrderDelivered(orderId: string) {
    console.log('🔔 Sending order delivered notification for:', orderId);
    try {
      const result = await this.sendNotification({
        type: NotificationType.ORDER_DELIVERED,
        title: 'Order Delivered!',
        body: 'Your order has been delivered. Enjoy your meal!',
        data: { orderId },
      });
      console.log('✅ Order delivered notification sent, ID:', result);
      
      // Save to notification history (fire and forget - don't block on errors)
      this.saveToHistory({
        type: NotificationType.ORDER_DELIVERED,
        title: 'Order Delivered!',
        body: 'Your order has been delivered. Enjoy your meal!',
        data: { orderId },
      }).catch(() => {}); // Silently ignore errors
      
      return result;
    } catch (error) {
      console.error('❌ Error sending delivered notification:', error);
      throw error;
    }
  }

  /**
   * Send order cancelled notification
   */
  async notifyOrderCancelled(orderId: string, reason?: string) {
    console.log('🔔 Sending order cancelled notification for:', orderId);
    try {
      const result = await this.sendNotification({
        type: NotificationType.ORDER_CANCELLED,
        title: 'Order Cancelled',
        body: reason || 'Your order has been cancelled.',
        data: { orderId, reason },
      });
      console.log('✅ Order cancelled notification sent, ID:', result);
      
      // Save to notification history (fire and forget - don't block on errors)
      this.saveToHistory({
        type: NotificationType.ORDER_CANCELLED,
        title: 'Order Cancelled',
        body: reason || 'Your order has been cancelled.',
        data: { orderId, reason },
      }).catch(() => {}); // Silently ignore errors
      
      return result;
    } catch (error) {
      console.error('❌ Error sending cancelled notification:', error);
      throw error;
    }
  }

  /**
   * Send booking confirmed notification
   */
  async notifyBookingConfirmed(bookingId: string, seatNumber: number, date: string) {
    return this.sendNotification({
      type: NotificationType.BOOKING_CONFIRMED,
      title: '🎊 Booking Confirmed!',
      body: `Your table (Seat ${seatNumber}) is booked for ${date}.`,
      data: { bookingId },
    });
  }

  /**
   * Send booking reminder notification
   */
  async notifyBookingReminder(bookingId: string, seatNumber: number, minutesBefore: number) {
    return this.scheduleNotification(
      {
        type: NotificationType.BOOKING_REMINDER,
        title: '⏰ Booking Reminder',
        body: `Your table booking (Seat ${seatNumber}) is in ${minutesBefore} minutes!`,
        data: { bookingId },
      },
      minutesBefore * 60
    );
  }

  /**
   * Send booking cancelled notification
   */
  async notifyBookingCancelled(bookingId: string, seatNumber: number) {
    return this.sendNotification({
      type: NotificationType.BOOKING_CANCELLED,
      title: '❌ Booking Cancelled',
      body: `Your booking for Seat ${seatNumber} has been cancelled.`,
      data: { bookingId },
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
