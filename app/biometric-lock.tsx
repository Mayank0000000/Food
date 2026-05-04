import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { biometricService } from '@/services/biometric.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { biometricLockStyles as styles } from '@/styles/screens/biometric-lock.styles';

export default function BiometricLock() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [biometricType, setBiometricType] = useState('Biometric');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    biometricService.getBiometricTypeName().then(setBiometricType);
    // Auto-prompt on screen open
    triggerBiometric();
  }, []);

  const triggerBiometric = async () => {
    setIsAuthenticating(true);
    try {
      const success = await biometricService.authenticate();
      if (success) {
        router.replace('/(tabs)/home');
      }
    } catch {
      // User cancelled — stays on lock screen
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUsePassword = async () => {
    Alert.alert(
      'Sign out required',
      'To use password login you need to sign out first. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const icon =
    biometricType === 'Face ID' ? 'scan-outline' : 'finger-print-outline';

  return (
    <RView style={styles.container}>
      <RView style={styles.top}>
        <Image
          source={require('@/assets/images/Logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text variant="title" style={styles.appName}>
          FooD
        </Text>
        {user?.name ? (
          <Text variant="body" style={styles.greeting}>
            Welcome back, {user.name.split(' ')[0]} 👋
          </Text>
        ) : null}
      </RView>

      <RView style={styles.middle}>
        <RView style={styles.iconRing}>
          <Ionicons name={icon} size={56} color="#FF6347" />
        </RView>

        <Text variant="title" style={styles.title}>
          App Locked
        </Text>
        <Text variant="body" style={styles.subtitle}>
          Use {biometricType} to continue
        </Text>
      </RView>

      <RView style={styles.bottom}>
        {isAuthenticating ? (
          <ActivityIndicator size="large" color="#FF6347" />
        ) : (
          <TouchableOpacity style={styles.scanButton} onPress={triggerBiometric}>
            <Ionicons name={icon} size={24} color="#fff" />
            <Text variant="body" style={styles.scanText}>
              {biometricType === 'Face ID' ? 'Scan Face' : 'Touch Sensor'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.passwordButton} onPress={handleUsePassword}>
          <Text variant="caption" style={styles.passwordText}>
            Use password instead
          </Text>
        </TouchableOpacity>
      </RView>
    </RView>
  );
}

