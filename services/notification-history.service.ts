import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { NotificationHistory, NotificationHistoryCreate } from '@/types/notification-history.types';
import { githubService } from './github.service';

class NotificationHistoryService {
  private readonly NOTIFICATIONS_FILE = API_ENDPOINTS.FILES.NOTIFICATIONS;

  /**
   * Create a new notification history entry
   */
  async createNotification(data: NotificationHistoryCreate): Promise<NotificationHistory> {
    try {
      // Get existing notifications
      const notifications: NotificationHistory[] = 
        (await githubService.getFile(this.NOTIFICATIONS_FILE)) || [];

      // Generate new notification ID
      const notificationId = `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new notification
      const newNotification: NotificationHistory = {
        ...data,
        id: notificationId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      // Add to notifications array
      notifications.push(newNotification);

      // Update notifications file
      await githubService.updateFile(
        this.NOTIFICATIONS_FILE,
        notifications,
        `Add notification ${notificationId}`
      );

      console.log('✅ Notification saved:', notificationId);
      return newNotification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string): Promise<NotificationHistory[]> {
    try {
      const notifications: NotificationHistory[] = 
        (await githubService.getFile(this.NOTIFICATIONS_FILE)) || [];
      
      return notifications
        .filter(notification => notification.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Failed to get user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications: NotificationHistory[] = 
        (await githubService.getFile(this.NOTIFICATIONS_FILE)) || [];

      const notificationIndex = notifications.findIndex(n => n.id === notificationId);
      if (notificationIndex === -1) {
        throw new Error('Notification not found');
      }

      // Update notification
      notifications[notificationIndex] = {
        ...notifications[notificationIndex],
        isRead: true,
        readAt: new Date().toISOString(),
      };

      // Save updated notifications
      await githubService.updateFile(
        this.NOTIFICATIONS_FILE,
        notifications,
        `Mark notification ${notificationId} as read`
      );

      console.log('✅ Notification marked as read:', notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifications: NotificationHistory[] = 
        (await githubService.getFile(this.NOTIFICATIONS_FILE)) || [];

      const now = new Date().toISOString();
      let updated = false;

      const updatedNotifications = notifications.map(notification => {
        if (notification.userId === userId && !notification.isRead) {
          updated = true;
          return {
            ...notification,
            isRead: true,
            readAt: now,
          };
        }
        return notification;
      });

      if (updated) {
        await githubService.updateFile(
          this.NOTIFICATIONS_FILE,
          updatedNotifications,
          `Mark all notifications as read for user ${userId}`
        );
        console.log('✅ All notifications marked as read for user:', userId);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications: NotificationHistory[] = 
        (await githubService.getFile(this.NOTIFICATIONS_FILE)) || [];
      
      return notifications.filter(
        notification => notification.userId === userId && !notification.isRead
      ).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications: NotificationHistory[] = 
        (await githubService.getFile(this.NOTIFICATIONS_FILE)) || [];

      const filteredNotifications = notifications.filter(n => n.id !== notificationId);

      await githubService.updateFile(
        this.NOTIFICATIONS_FILE,
        filteredNotifications,
        `Delete notification ${notificationId}`
      );

      console.log('✅ Notification deleted:', notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }
}

export const notificationHistoryService = new NotificationHistoryService();

// Export individual functions for convenience
export const createNotification = (data: NotificationHistoryCreate) =>
  notificationHistoryService.createNotification(data);
export const getUserNotifications = (userId: string) =>
  notificationHistoryService.getUserNotifications(userId);
export const markAsRead = (notificationId: string) =>
  notificationHistoryService.markAsRead(notificationId);
export const markAllAsRead = (userId: string) =>
  notificationHistoryService.markAllAsRead(userId);
export const getUnreadCount = (userId: string) =>
  notificationHistoryService.getUnreadCount(userId);
export const deleteNotification = (notificationId: string) =>
  notificationHistoryService.deleteNotification(notificationId);
