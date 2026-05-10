import * as Linking from 'expo-linking';
import { router } from 'expo-router';


/**
 * Parse deep link URL and extract parameters
 */
export function parseDeepLink(url: string) {
  const parsed = Linking.parse(url);
  return {
    path: parsed.path,
    queryParams: parsed.queryParams,
    hostname: parsed.hostname,
  };
}

/**
 * Handle incoming deep link URL
 */
export function handleDeepLink(url: string) {
  
  const { path, queryParams } = parseDeepLink(url);
  
  if (!path) {
    console.warn('⚠️ No path in deep link');
    return;
  }

  // Handle different deep link paths
  switch (path) {
    case 'order-tracking':
      if (queryParams?.orderId) {
        router.push(`/order-tracking?orderId=${queryParams.orderId}`);
      } else {
        console.warn('⚠️ No orderId in order-tracking deep link');
      }
      break;

    case 'cart':
      router.push('/(tabs)/cart');
      break;

    case 'my-orders':
      router.push('/my-orders');
      break;

    case 'my-bookings':
      router.push('/my-bookings');
      break;

    case 'notifications':
      router.push('/notifications');
      break;

    case 'home':
      router.push('/(tabs)/home');
      break;

    default:
      router.push(path as any);
  }
}

/**
 * Initialize deep linking listeners
 */
export function initializeDeepLinking() {
  // Handle deep link when app is already open
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  // Handle deep link when app is opened from closed state
  Linking.getInitialURL().then((url) => {
    if (url) {
      // Add a small delay to ensure app is ready
      setTimeout(() => {
        handleDeepLink(url);
      }, 500);
    }
  });

  return subscription;
}

/**
 * Create deep link URL for order tracking
 */
export function createOrderTrackingLink(orderId: string): string {
  return Linking.createURL('order-tracking', {
    queryParams: { orderId },
  });
}

/**
 * Create deep link URL for bookings
 */
export function createBookingsLink(): string {
  return Linking.createURL('my-bookings');
}

/**
 *  deep link URL for orders
 */
export function createOrdersLink(): string {
  return Linking.createURL('my-orders');
}

/**
 *deep link URL for cart
 */
export function createCartLink(): string {
  return Linking.createURL('cart');
}
