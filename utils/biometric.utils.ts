import { biometricService } from '@/services/biometric.service';

export interface BiometricStatus {
  available: boolean;
  enrolled: boolean;
  enabled: boolean;
  typeName: string;
}

/**
 * Check biometric availability and status
 */
export const checkBiometricAvailability = async (): Promise<BiometricStatus> => {
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
    console.error('Error checking biometric availability:', error);
    return {
      available: false,
      enrolled: false,
      enabled: false,
      typeName: 'Biometric',
    };
  }
};
