import { Router } from 'expo-router';

export interface AccountMenuItem {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: number;
  onPress: () => void;
}

interface GetAccountMenuItemsParams {
  t: (key: string, params?: any) => string;
  router: Router;
  activeBookingsCount: number;
  unreadNotificationsCount: number;
  currentLanguageName: string;
  onLanguagePress: () => void;
}

export const getAccountMenuItems = ({
  t,
  router,
  activeBookingsCount,
  unreadNotificationsCount,
  currentLanguageName,
  onLanguagePress,
}: GetAccountMenuItemsParams): AccountMenuItem[] => {
  return [
    {
      icon: 'receipt-outline',
      title: t('account.menuItems.myOrders'),
      onPress: () => {
        router.push('/my-orders');
      },
    },
    {
      icon: 'restaurant-outline',
      title: t('account.menuItems.myBookings'),
      badge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
      onPress: () => {
        router.push('/my-bookings');
      },
    },
    {
      icon: 'bookmark-outline',
      title: 'Bookmarks',
      subtitle: 'Your favorite dishes',
      onPress: () => {
        router.push('/bookmarks');
      },
    },
    {
      icon: 'chatbubbles-outline',
      title: 'Customer Support',
      subtitle: 'Chat with our AI assistant',
      onPress: () => {
        router.push('/chat');
      },
    },
    {
      icon: 'person-outline',
      title: t('account.menuItems.editProfile'),
      onPress: () => {
        router.push('/edit-profile');
      },
    },
    {
      icon: 'notifications-outline',
      title: t('account.menuItems.notifications'),
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      onPress: () => {
        router.push('/notifications');
      },
    },
    {
      icon: 'language-outline',
      title: 'Language',
      subtitle: currentLanguageName,
      onPress: onLanguagePress,
    },
  ];
};
