import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { accountStyles } from '@/styles/screens/account.styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Switch } from 'react-native';

interface BiometricToggleProps {
  biometricType: string;
  biometricAvailable: boolean;
  biometricEnrolled: boolean;
  biometricEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export function BiometricToggle({
  biometricType,
  biometricAvailable,
  biometricEnrolled,
  biometricEnabled,
  onToggle,
}: BiometricToggleProps) {
  const icon = biometricType === 'Face ID' ? 'scan-outline' : 'finger-print-outline';

  return (
    <RView style={accountStyles.section}>
      <Text variant="subtitle" style={accountStyles.sectionTitle}>
        Security
      </Text>

      <RView style={accountStyles.menuItem}>
        <Ionicons
          name={icon}
          size={24}
          color="#666"
          style={accountStyles.menuIcon}
        />

        <RView style={{ flex: 1 }}>
          <Text variant="body" style={accountStyles.menuText}>
            {biometricType} Login
          </Text>

          {!biometricAvailable && (
            <Text variant="caption" style={{ color: '#999', marginTop: 2 }}>
              Not available on this device
            </Text>
          )}

          {biometricAvailable && !biometricEnrolled && (
            <Text variant="caption" style={{ color: '#999', marginTop: 2 }}>
              Set up {biometricType} in device settings
            </Text>
          )}
        </RView>

        <Switch
          value={biometricEnabled}
          onValueChange={onToggle}
          disabled={!biometricAvailable || !biometricEnrolled}
          trackColor={{ false: '#E0E0E0', true: '#FF6347' }}
          thumbColor="#FFF"
        />
      </RView>
    </RView>
  );
}
