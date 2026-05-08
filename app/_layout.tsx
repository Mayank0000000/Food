import { DeliveryAlertProvider } from '@/contexts/delivery-alert-context';
import { ToastProvider } from '@/contexts/toast-context';
import { notificationService } from '@/services/notification.service';
import { RootState, store } from '@/store';
import { fetchCart } from '@/store/slices/cartSlice';
import { loadTheme } from '@/store/slices/themeSlice';
import { initializeDeepLinking } from '@/utils/deep-linking.utils';
import { Stack } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';

function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const appState = useRef(AppState.currentState);
  const cartRef = useRef(cart);

  // Keep cart ref updated
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    // Load theme from storage
    dispatch(loadTheme() as any);

    // Load cart from storage when user is authenticated
    if (user?.id) {
      console.log('🛒 Loading cart for user:', user.id);
      dispatch(fetchCart(user.id.toString()) as any);
    }

    // Initialize notification service on app start
    // Note: The warning about push notifications in Expo Go can be ignored
    // We're using local notifications which work fine in Expo Go
    notificationService.initialize(user?.id.toString()).catch((error) => {
      console.log('Notification initialization warning (can be ignored):', error.message);
    });

    // Initialize deep linking
    const deepLinkSubscription = initializeDeepLinking();
    console.log('🔗 Deep linking initialized');

    // Update user ID when user changes
    if (user?.id) {
      notificationService.setUserId(user.id.toString());
    }

    // Listen for app state changes (foreground/background)
    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const previousState = appState.current;
      appState.current = nextAppState;

      // App is going to background (minimized, not closed)
      if (previousState === 'active' && nextAppState === 'background') {
        console.log('📱 App minimized to background');
        
        // Use cartRef to get current cart state
        const currentCart = cartRef.current;
        
        // Schedule cart reminder ONLY when app is minimized
        if (currentCart && currentCart.items && currentCart.items.length > 0) {
          const itemNames = currentCart.items.map((item) => item.menuItem.name);
          console.log('🛒 Scheduling cart reminder (app minimized) for', currentCart.totalItems, 'items');
          notificationService.scheduleCartReminder(currentCart.totalItems, itemNames, 5);
        } else {
          console.log('🛒 Cart is empty, not scheduling reminder');
        }
      }

      // App is coming to foreground
      if (previousState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('📱 App coming to foreground');
        
        // Cancel cart reminders when app comes back to foreground
        notificationService.cancelCartReminders();
        
        // Reload cart when coming back to foreground
        if (user?.id) {
          console.log('🛒 Reloading cart on foreground');
          dispatch(fetchCart(user.id.toString()) as any);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      notificationService.cleanup();
      deepLinkSubscription.remove();
      appStateSubscription.remove();
    };
  }, [user?.id]);

  // Remove the cart change effect - we only schedule on background now
  // This prevents random notifications when cart changes while app is active

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
