import { BiometricToggle } from '@/components/account/biometric-toggle';
import { Alert as CustomAlert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { biometricService } from '@/services/biometric.service';
import { dineService } from '@/services/dine.service';
import { notificationHistoryService } from '@/services/notification-history.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { accountStyles } from '@/styles/screens/account.styles';
import { DineBooking } from '@/types/dine.types';
import { getBiometricStatus, toggleBiometric } from '@/utils/biometric';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';

export default function Account() {
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
    setComingSoonMessage(`${feature} will be available soon!`);
    setShowComingSoonAlert(true);
  };

  const menuItems = [
    {
      icon: 'receipt-outline',
      title: 'My Orders',
      onPress: () => {
        router.push('/my-orders');
      },
    },
    {
      icon: 'restaurant-outline',
      title: 'My Bookings',
      badge: activeBookings.length > 0 ? activeBookings.length : undefined,
      onPress: () => {
        router.push('/my-bookings');
      },
    },
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => {
        showComingSoon('Edit profile feature');
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
      onPress: () => {
        router.push('/notifications');
      },
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      onPress: () => {
        showComingSoon('Payment methods');
      },
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      onPress: () => {
        showComingSoon('Address management');
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
          <Text variant="subtitle" style={accountStyles.sectionTitle}>Account</Text>
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
                color="#666"
                style={accountStyles.menuIcon}
              />
              <Text variant="body" style={accountStyles.menuText}>{item.title}</Text>
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

        <Text variant="caption" style={accountStyles.version}>Version 1.0.0</Text>
      </RView>

      <Button
        title="Logout"
        onPress={handleLogout}
        style={accountStyles.logoutButton}
      />

      {/* Logout Confirmation Alert */}
      <CustomAlert
        visible={showLogoutAlert}
        title="Logout"
        message="Are you sure you want to logout?"
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setShowLogoutAlert(false),
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: confirmLogout,
          },
        ]}
        onDismiss={() => setShowLogoutAlert(false)}
      />

      {/* Coming Soon Alert */}
      <CustomAlert
        visible={showComingSoonAlert}
        title="Coming Soon"
        message={comingSoonMessage}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowComingSoonAlert(false),
          },
        ]}
        onDismiss={() => setShowComingSoonAlert(false)}
      />

    </ScrollView>
  );
}