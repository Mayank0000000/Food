import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';
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
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
      }

      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      }, 2000);
    };

    initializeApp();
  }, [dispatch, router, isAuthenticated]);

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