import { useAuth } from '@/hooks/useAuth';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { createTabStyles } from '@/styles/tabs.styles';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
  const { t } = useCMS();
  const { isAuthenticated, isLoading } = useAuth('/(auth)/login');
  const { theme, colors } = useTheme();
  const tabStyles = useMemo(() => createTabStyles(theme), [theme]);
  
  // Get cart item count from Redux store
  const cartItemCount = useAppSelector((state) => state.cart.cart?.totalItems || 0);

  if (isLoading) {
    return (
      <View style={tabStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: tabStyles.tabBar,
        tabBarLabelStyle: tabStyles.tabBarLabel,
        tabBarBadgeStyle: {
          backgroundColor: colors.primary,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: 'bold',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          marginLeft: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explorer"
        options={{
          title: t('tabs.explorer'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('tabs.cart'),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "bag" : "bag-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabs.account'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}