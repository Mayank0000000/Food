import { Router } from 'expo-router';

import { NavigationAction } from '@/types/chat.types';

/**
 * Handle navigation actions from chat bot responses
 * @param action - Navigation action from chat service
 * @param router - Expo router instance
 * @param dispatch - Redux dispatch function
 * @param actions - Redux action creators for setting pending state
 */
export const handleChatNavigation = (
  action: NavigationAction,
  router: Router,
  dispatch: any,
  actions: {
    setPendingFilters: (filters: any) => any;
    setPendingCategory: (category: string) => any;
    setPendingSearchQuery: (query: string) => any;
  },
) => {
  setTimeout(() => {
    switch (action.type) {
      case 'explorer':
        // Set filters in Redux before navigating
        if (action.params?.filters) {
          dispatch(actions.setPendingFilters(action.params.filters));
        }
        if (action.params?.category) {
          dispatch(actions.setPendingCategory(action.params.category));
        }
        if (action.params?.searchQuery) {
          dispatch(actions.setPendingSearchQuery(action.params.searchQuery));
        }
        router.push('/(tabs)/explorer');
        break;
      case 'orders':
        router.push('/my-orders');
        break;
      case 'bookings':
        router.push('/my-bookings');
        break;
      case 'dine-in':
        router.push('/dine-in');
        break;
      case 'order-tracking':
        if (action.params?.orderId) {
          router.push(`/order-tracking?orderId=${action.params.orderId}`);
        }
        break;
    }
  }, 1000); // Small delay so user can see the message
};
