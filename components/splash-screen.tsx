import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';
import { biometricService } from '@/services/biometric.service';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { splashStyles } from '../styles/splash.styles';
import { RView } from './ui/rview';

export default function SplashScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      let authenticated = false;

      try {
        await dispatch(checkAuth()).unwrap();
        authenticated = true;
      } catch {
        authenticated = false;
      }

      setTimeout(async () => {
        if (authenticated) {
          // Check if biometric lock is enabled on this device
          const biometricEnabled = await biometricService.isBiometricEnabled();
          if (biometricEnabled) {
            // Send to lock screen — user must scan to enter
            router.replace('/biometric-lock');
          } else {
            router.replace('/(tabs)/home');
          }
        } else {
          router.replace('/(auth)/login');
        }
      }, 1500);
    };

    initializeApp();
  }, [dispatch, router]);

  return (
    <RView style={splashStyles.container}>
      <RView style={splashStyles.content}>
        <Image
          source={require('@/assets/images/Logo.png')}
          style={splashStyles.logo}
          contentFit="contain"
        />
      </RView>
    </RView>
  );
}