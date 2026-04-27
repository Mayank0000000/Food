import { ToastProvider } from '@/contexts/toast-context';
import { store } from '@/store';
import { Stack } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ToastProvider>
    </Provider>
  );
}
