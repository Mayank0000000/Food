import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { accountStyles } from '@/styles/screens/account.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';

export default function Account() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => {
        Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => {
        Alert.alert('Coming Soon', 'Notification settings will be available soon!');
      },
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      onPress: () => {
        Alert.alert('Coming Soon', 'Payment methods will be available soon!');
      },
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      onPress: () => {
        Alert.alert('Coming Soon', 'Address management will be available soon!');
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
              <Ionicons
                name="chevron-forward"
                size={20}
                style={accountStyles.menuArrow}
              />
            </TouchableOpacity>
          ))}
        </RView>

        <Text variant="caption" style={accountStyles.version}>Version 1.0.0</Text>
      </RView>

      <Button
        title="Logout"
        onPress={handleLogout}
        style={accountStyles.logoutButton}
      />
    </ScrollView>
  );
}