

import { NotificationConfig, NotificationData, NotificationType } from '@/types/notification.types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// default notification behavior
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
  private responseListener: Notifications.EventSubscription | null = null;
  private currentUserId: string | null = null;
  private pendingNotificationResponse: Notifications.NotificationResponse | null = null;
  private isAppReady: boolean = false;

  /**
   * Initialize notification service
   */
  async initialize(userId?: string) {
    if (userId) {
      this.currentUserId = userId;
    }
    await this.requestPermissions();
    this.setupListeners();
    
    // Handle notification that opened the app (when app was closed)
    await this.handleInitialNotification();
    
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

    // Cart reminders channel
    await Notifications.setNotificationChannelAsync('cart', {
      name: 'Cart Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
      showBadge: true,
    });
  }

  /**
   * Setup notification listeners
   */
  private setupListeners() {
    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        this.handleNotificationResponse(response);
      }
    );
  }

  /**
   * Handle notification that opened the app from closed state
   */
  private async handleInitialNotification() {
    try {
      const response = await Notifications.getLastNotificationResponseAsync();
      
      if (response) {
        
        // Store the notification response to handle after app is ready
        this.pendingNotificationResponse = response;
      }
    } catch (error) {
      console.error('Error handling initial notification:', error);
    }
  }

  /**
   * Mark app as ready and handle any pending notifications
   * Call this after the app has completed initialization (after splash screen)
   */
  async setAppReady() {
    this.isAppReady = true;
    
    // Handle any pending notification
    if (this.pendingNotificationResponse) {
      await this.handleNotificationResponse(this.pendingNotificationResponse);
      this.pendingNotificationResponse = null;
    }
  }

  /**
   * Handle notification tap/response
   */
  private async handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    
    // If app is not ready yet, store for later
    if (!this.isAppReady) {
      this.pendingNotificationResponse = response;
      return;
    }
    
    // Navigate based on notification type
    if (data.type) {
      // Import router dynamically to avoid circular dependencies
      const { router } = await import('expo-router');
      
      switch (data.type) {
        case NotificationType.ORDER_PLACED:
        case NotificationType.ORDER_CONFIRMED:
        case NotificationType.ORDER_PREPARING:
        case NotificationType.ORDER_OUT_FOR_DELIVERY:
        case NotificationType.ORDER_DELIVERED:
        case NotificationType.ORDER_CANCELLED:
          // Navigate to order tracking with orderId
          if (data.orderId) {
            router.push(`/order-tracking?orderId=${data.orderId}`);
          }
          break;
        
        case NotificationType.BOOKING_CONFIRMED:
        case NotificationType.BOOKING_REMINDER:
        case NotificationType.BOOKING_CANCELLED:
          // Navigate to bookings
          router.push('/my-bookings');
          break;
        
        case NotificationType.CART_REMINDER:
          // Navigate to cart (use replace to override splash screen navigation)
          router.replace('/(tabs)/cart');
          break;
        
        case NotificationType.PROMOTION:
          // Navigate to home or promotions section
          router.push('/(tabs)/home');
          break;
      }
    }
  }

  /**
   * Send local notification immediately (internal use only)
   */
  private async sendNotification(
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
   * Schedule notification for later (internal use only)
   */
  private async scheduleNotification(
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
   * Get all scheduled notifications (internal use only)
   */
  private async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
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

    if (type === NotificationType.CART_REMINDER) {
      return 'cart';
    }

    return 'promotions';
  }

  /**
   * Cleanup listeners
   */
  cleanup() {
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
    try {
      const result = await this.sendNotification({
        type: NotificationType.ORDER_PLACED,
        title: 'Order Placed!',
        body: `Your order from ${restaurantName} has been placed successfully.`,
        data: { orderId, restaurantName },
      });
      
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
    try {
      const result = await this.sendNotification({
        type: NotificationType.ORDER_DELIVERED,
        title: 'Order Delivered!',
        body: 'Your order has been delivered. Enjoy your meal!',
        data: { orderId },
      });
      
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
    try {
      const result = await this.sendNotification({
        type: NotificationType.ORDER_CANCELLED,
        title: 'Order Cancelled',
        body: reason || 'Your order has been cancelled.',
        data: { orderId, reason },
      });
      
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
   * Schedule cart reminder notification
   * Sends a notification after specified seconds if user has items in cart
   */
  async scheduleCartReminder(itemCount: number, itemNames: string[], delaySeconds: number = 5) {
    
    try {
      // Cancel any existing cart reminders first
      await this.cancelCartReminders();
      
      // Create a friendly message based on item count
      let body: string;
      if (itemCount === 1) {
        body = `You have ${itemNames[0]} in your cart. Complete your order now!`;
      } else if (itemCount === 2) {
        body = `You have ${itemNames[0]} and ${itemNames[1]} in your cart. Don't forget to checkout!`;
      } else {
        body = `You have ${itemCount} items in your cart including ${itemNames[0]}. Complete your order!`;
      }
      
      const notificationId = await this.scheduleNotification(
        {
          type: NotificationType.CART_REMINDER,
          title: '🛍️ Items in Your Cart',
          body,
          data: { itemCount, itemNames },
        },
        delaySeconds
      );
      
      return notificationId;
    } catch (error) {
      console.error('❌ Error scheduling cart reminder:', error);
      throw error;
    }
  }

  /**
   * Cancel all cart reminder notifications
   */
  async cancelCartReminders() {
    try {
      const scheduled = await this.getScheduledNotifications();
      
      for (const notification of scheduled) {
        const data = notification.content.data as any;
        if (data?.type === NotificationType.CART_REMINDER) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling cart reminders:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
