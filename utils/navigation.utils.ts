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
      console.log('🔗 Deep link: Navigating to order tracking:', orderId);
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
      console.log('🔗 Deep link: Navigating to my orders');
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
      console.log('🔗 Deep link: Navigating to my bookings');
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
      console.log('🔗 Deep link: Navigating to home');
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
      console.log('🔗 Deep link: Navigating to notifications');
      router.push('/notifications');
    } catch (error) {
      console.error('Error navigating to notifications:', error);
    }
  }
}
