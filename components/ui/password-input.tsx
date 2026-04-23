import { passwordInputStyles } from '@/styles/components/password-input.styles';
import { PasswordInputProps } from '@/types/components/password-input.types';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from './text';

export function PasswordInput({ label, error, style, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={passwordInputStyles.container}>
      <View style={passwordInputStyles.labelContainer}>
        <Text variant="label">{label}</Text>
      </View>
      <View style={[passwordInputStyles.passwordContainer, error && passwordInputStyles.inputError]}>
        <TextInput
          style={[passwordInputStyles.passwordInput, style]}
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={passwordInputStyles.eyeButton}
        >
          <Text style={passwordInputStyles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
        </TouchableOpacity>
      </View>
      {error && <Text variant="error">{error}</Text>}
    </View>
  );
}
