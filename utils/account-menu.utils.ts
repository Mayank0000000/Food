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
      title: t('account.menuItems.bookmarks'),
      subtitle: t('account.menuItems.bookmarksSubtitle'),
      onPress: () => {
        router.push('/bookmarks');
      },
    },
    {
      icon: 'chatbubbles-outline',
      title: t('account.menuItems.customerSupport'),
      subtitle: t('account.menuItems.customerSupportSubtitle'),
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
      icon: 'location-outline',
      title: t('account.menuItems.addresses'),
      onPress: () => {
        router.push('/addresses');
      },
    },
    {
      icon: 'language-outline',
      title: t('account.menuItems.language'),
      subtitle: currentLanguageName,
      onPress: onLanguagePress,
    },
  ];
};
