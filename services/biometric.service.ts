import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

class BiometricService {
  /** Check if device hardware supports biometrics */
  async isAvailable(): Promise<boolean> {
    try {
      return await LocalAuthentication.hasHardwareAsync();
    } catch {
      return false;
    }
  }

  /** Check if user has enrolled fingerprint/face on the device */
  async isEnrolled(): Promise<boolean> {
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch {
      return false;
    }
  }

  /** Check if biometric login is enabled on this device */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      return value === 'true';
    } catch {
      return false;
    }
  }

  /** Returns the biometric type name (Face ID / Fingerprint / Iris) */
  async getBiometricTypeName(): Promise<string> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'Face ID';
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'Fingerprint';
      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'Iris';
      return 'Biometric';
    } catch {
      return 'Biometric';
    }
  }

  /**
   * Enable biometric login — just verify once with a scan and save the flag.
   * No passwords, no credentials stored.
   */
  async enableBiometric(): Promise<boolean> {
    try {
      const typeName = await this.getBiometricTypeName();
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Confirm with ${typeName} to enable biometric login`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!result.success) return false;

      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
      return true;
    } catch {
      return false;
    }
  }

  /** Disable biometric login and clear the flag */
  async disableBiometric(): Promise<void> {
    await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
  }

  /**
   * Trigger biometric scan on login screen.
   * Returns true if scan succeeded — caller restores session from AsyncStorage.
   */
  async authenticate(): Promise<boolean> {
    try {
      const typeName = await this.getBiometricTypeName();
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Sign in with ${typeName}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  }
}

export const biometricService = new BiometricService();
