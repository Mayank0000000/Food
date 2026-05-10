import { router } from 'expo-router';

/**
 * Navigation utility for deep linking
 */
export class NavigationUtils {
  /**
   * Navigate to order tracking page
   */
  static navigateToOrderTracking(orderId: string) {
    try {
      router.push(`/order-tracking?orderId=${orderId}`);
    } catch (error) {
      console.error('Error navigating to order tracking:', error);
    }
  }

  /**
   * Navigate to my orders page
   */
  static navigateToMyOrders() {
    try {
      router.push('/my-orders');
    } catch (error) {
      console.error('Error navigating to my orders:', error);
    }
  }

  /**
   * Navigate to my bookings page
   */
  static navigateToMyBookings() {
    try {
      router.push('/my-bookings');
    } catch (error) {
      console.error('Error navigating to my bookings:', error);
    }
  }

  /**
   * Navigate to home page
   */
  static navigateToHome() {
    try {
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Error navigating to home:', error);
    }
  }

  /**
   * Navigate to notifications page
   */
  static navigateToNotifications() {
    try {
      router.push('/notifications');
    } catch (error) {
      console.error('Error navigating to notifications:', error);
    }
  }
}
