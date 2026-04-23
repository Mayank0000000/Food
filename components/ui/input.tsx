import { inputStyles } from '@/styles/components/input.styles';
import { InputProps } from '@/types/components/input.types';
import React from 'react';
import { TextInput, View } from 'react-native';
import { Text } from './text';

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={inputStyles.container}>
      <Text variant="label">{label}</Text>
      <TextInput
        style={[inputStyles.input, error && inputStyles.inputError, style]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text variant="error">{error}</Text>}
    </View>
  );
}
