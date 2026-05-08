/**
 * Deep linking configuration for the app
 * Handles navigation from notifications and external links
 */
export const linking = {
  prefixes: [
    'food://', // Custom scheme
    'https://food.app', // Universal links (if configured)
  ],
  config: {
    screens: {
      // Auth screens
      '(auth)': {
        screens: {
          login: 'login',
          signup: 'signup',
        },
      },
      // Tab screens
      '(tabs)': {
        screens: {
          home: 'home',
          explorer: 'explorer',
          cart: 'cart',
          orders: 'orders',
          profile: 'profile',
        },
      },
      // Order tracking with orderId parameter
      'order-tracking': {
        path: 'order-tracking/:orderId?',
        parse: {
          orderId: (orderId: string) => orderId,
        },
      },
      // My orders
      'my-orders': 'my-orders',
      // My bookings
      'my-bookings': 'my-bookings',
      // Notifications
      'notifications': 'notifications',
      // Chat
      'chat': 'chat',
      // Dine-in booking
      'dine-in': 'dine-in',
      // Edit profile
      'edit-profile': 'edit-profile',
    },
  },
};
