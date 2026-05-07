import { BiometricToggle } from '@/components/account/biometric-toggle';
import { LanguageSelector } from '@/components/settings/language-selector';
import { ThemeToggle } from '@/components/settings/theme-toggle';
import { Alert as CustomAlert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { dineService } from '@/services/dine.service';
import { notificationHistoryService } from '@/services/notification-history.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { createAccountStyles } from '@/styles/screens/account.styles';
import { DineBooking } from '@/types/dine.types';
import { getBiometricStatus, toggleBiometric } from '@/utils/biometric';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

export default function Account() {
  const { t, getLanguage, getAvailableLanguages } = useCMS();
  const { theme, colors } = useTheme();
  const accountStyles = useMemo(() => createAccountStyles(theme), [theme]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeBookings, setActiveBookings] = useState<DineBooking[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Biometric states
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');

  // Alert states
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showComingSoonAlert, setShowComingSoonAlert] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadActiveBookings();
      loadUnreadNotifications();
      getBiometricStatus().then((status) => {
        setBiometricAvailable(status.available);
        setBiometricEnrolled(status.enrolled);
        setBiometricEnabled(status.enabled);
        setBiometricType(status.typeName);
      });
    }, [user])
  );

  const loadActiveBookings = async () => {
    if (!user) return;

    try {
      const bookings = await dineService.getUserBookings(user.id.toString());
      const active = bookings.filter(
        (b) => b.status === 'active' && new Date(b.bookedUntil) > new Date()
      );
      setActiveBookings(active);
    } catch (error) {
      console.error('Error loading active bookings:', error);
    }
  };

  const loadUnreadNotifications = async () => {
    if (!user) return;

    try {
      const count = await notificationHistoryService.getUnreadCount(user.id.toString());
      setUnreadNotifications(count);
    } catch (error) {
      console.error('Error loading unread notifications:', error);
    }
  };



  const handleBiometricToggle = (value: boolean) => {
    toggleBiometric(
      value,
      { available: biometricAvailable, enrolled: biometricEnrolled, typeName: biometricType },
      setBiometricEnabled
    );
  };

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const confirmLogout = async () => {
    setShowLogoutAlert(false);
    await dispatch(logout());
    router.replace('/(auth)/login');
  };

  const showComingSoon = (feature: string) => {
    setComingSoonMessage(t('account.alerts.comingSoonMessage', { feature }));
    setShowComingSoonAlert(true);
  };

  const getCurrentLanguageName = () => {
    const currentLang = getLanguage();
    const languages = getAvailableLanguages();
    const lang = languages.find(l => l.code === currentLang);
    return lang?.nativeName || 'English';
  };

  const menuItems = [
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
      badge: activeBookings.length > 0 ? activeBookings.length : undefined,
      onPress: () => {
        router.push('/my-bookings');
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
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
      onPress: () => {
        router.push('/notifications');
      },
    },
    {
      icon: 'card-outline',
      title: t('account.menuItems.paymentMethods'),
      onPress: () => {
        showComingSoon(t('account.menuItems.paymentMethods'));
      },
    },
    {
      icon: 'location-outline',
      title: t('account.menuItems.addresses'),
      onPress: () => {
        showComingSoon(t('account.menuItems.addresses'));
      },
    },
    {
      icon: 'language-outline',
      title: 'Language',
      subtitle: getCurrentLanguageName(),
      onPress: () => {
        setShowLanguageSelector(true);
      },
    },
  ];

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <ScrollView style={accountStyles.container} showsVerticalScrollIndicator={false}>
      <RView style={accountStyles.header}>
        <RView style={accountStyles.profileImage}>
          <Text variant="title" style={accountStyles.profileInitial}>
            {getInitial(user?.name || '')}
          </Text>
        </RView>
        <Text variant="title" style={accountStyles.userName}>{user?.name || 'User'}</Text>
        <Text variant="body" style={accountStyles.userEmail}>{user?.email || 'user@example.com'}</Text>
      </RView>

      <RView style={accountStyles.content}>
        <RView style={accountStyles.section}>
          <Text variant="subtitle" style={accountStyles.sectionTitle}>{t('account.title')}</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                accountStyles.menuItem,
                index === menuItems.length - 1 && accountStyles.menuItemLast,
              ]}
              onPress={item.onPress}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.textSecondary}
                style={accountStyles.menuIcon}
              />
              <RView style={{ flex: 1 }}>
                <Text variant="body" style={accountStyles.menuText}>{item.title}</Text>
                {item.subtitle && (
                  <Text variant="caption" style={{ color: colors.textTertiary, marginTop: 2 }}>
                    {item.subtitle}
                  </Text>
                )}
              </RView>
              {item.badge && (
                <RView style={accountStyles.badge}>
                  <Text variant="caption" style={accountStyles.badgeText}>
                    {item.badge}
                  </Text>
                </RView>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                style={accountStyles.menuArrow}
              />
            </TouchableOpacity>
          ))}
        </RView>

        {/* Security Section */}
        <BiometricToggle
          biometricType={biometricType}
          biometricAvailable={biometricAvailable}
          biometricEnrolled={biometricEnrolled}
          biometricEnabled={biometricEnabled}
          onToggle={handleBiometricToggle}
        />

        {/* Theme Toggle */}
        <ThemeToggle />

        <Text variant="caption" style={accountStyles.version}>Version 1.0.0</Text>
      </RView>

      <Button
        title={t('account.logout')}
        onPress={handleLogout}
        style={accountStyles.logoutButton}
      />

      {/* Logout Confirmation Alert */}
      <CustomAlert
        visible={showLogoutAlert}
        title={t('account.alerts.logoutTitle')}
        message={t('account.alerts.logoutMessage')}
        buttons={[
          {
            text: t('account.alerts.cancel'),
            style: 'cancel',
            onPress: () => setShowLogoutAlert(false),
          },
          {
            text: t('account.alerts.logout'),
            style: 'destructive',
            onPress: confirmLogout,
          },
        ]}
        onDismiss={() => setShowLogoutAlert(false)}
      />

      {/* Coming Soon Alert */}
      <CustomAlert
        visible={showComingSoonAlert}
        title={t('account.alerts.comingSoonTitle')}
        message={comingSoonMessage}
        buttons={[
          {
            text: t('common.ok'),
            onPress: () => setShowComingSoonAlert(false),
          },
        ]}
        onDismiss={() => setShowComingSoonAlert(false)}
      />

      {/* Language Selector */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onLanguageChange={() => {
          // Force re-render to update all text
          setShowLanguageSelector(false);
        }}
      />

    </ScrollView>
  );
}