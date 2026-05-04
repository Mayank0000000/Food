import { DeliveryAlertProvider } from '@/contexts/delivery-alert-context';
import { ToastProvider } from '@/contexts/toast-context';
import { notificationService } from '@/services/notification.service';
import { store } from '@/store';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { RootState } from './store/types';

function AppContent() {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Initialize notification service on app start
    // Note: The warning about push notifications in Expo Go can be ignored
    // We're using local notifications which work fine in Expo Go
    notificationService.initialize(user?.id.toString()).catch((error) => {
      console.log('Notification initialization warning (can be ignored):', error.message);
    });

    // Update user ID when user changes
    if (user?.id) {
      notificationService.setUserId(user.id.toString());
    }

    // Cleanup on unmount
    return () => {
      notificationService.cleanup();
    };
  }, [user?.id]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="biometric-lock" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <DeliveryAlertProvider>
          <AppContent />
        </DeliveryAlertProvider>
      </ToastProvider>
    </Provider>
  );
}
