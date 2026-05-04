import { biometricService } from '@/services/biometric.service';
import { Alert } from 'react-native';

export interface BiometricStatus {
  available: boolean;
  enrolled: boolean;
  enabled: boolean;
  typeName: string;
}

/**
 * Utility to fetch all biometric status values in a single call.
 */
export const getBiometricStatus = async (): Promise<BiometricStatus> => {
  try {
    const available = await biometricService.isAvailable();
    const enrolled = await biometricService.isEnrolled();
    const enabled = await biometricService.isBiometricEnabled();
    const typeName = await biometricService.getBiometricTypeName();

    return {
      available,
      enrolled,
      enabled,
      typeName,
    };
  } catch (error) {
    console.error('Error getting biometric status:', error);
    return {
      available: false,
      enrolled: false,
      enabled: false,
      typeName: 'Biometric',
    };
  }
};

/**
 * Utility to handle toggling the biometric setting, including showing alerts.
 */
export const toggleBiometric = async (
  value: boolean,
  status: Pick<BiometricStatus, 'available' | 'enrolled' | 'typeName'>,
  onSuccess: (enabled: boolean) => void
) => {
  if (!status.available) {
    Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
    return;
  }
  if (!status.enrolled) {
    Alert.alert('Not Set Up', `Please set up ${status.typeName} in your device settings first.`);
    return;
  }

  if (value) {
    const success = await biometricService.enableBiometric();
    if (success) {
      onSuccess(true);
      Alert.alert('Enabled', `${status.typeName} login is now enabled.`);
    } else {
      Alert.alert('Cancelled', `${status.typeName} login was not enabled.`);
    }
  } else {
    await biometricService.disableBiometric();
    onSuccess(false);
    Alert.alert('Disabled', `${status.typeName} login has been disabled.`);
  }
};
