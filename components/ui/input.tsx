import { useTheme } from '@/hooks/useTheme';
import { createInputStyles } from '@/styles/components/input.styles';
import { InputProps } from '@/types/components/input.types';
import React, { useMemo } from 'react';
import { TextInput, View } from 'react-native';
import { Text } from './text';

export function Input({ label, error, style, ...props }: InputProps) {
  const { theme, colors } = useTheme();
  const inputStyles = useMemo(() => createInputStyles(theme), [theme]);
  
  return (
    <View style={inputStyles.container}>
      <Text variant="label">{label}</Text>
      <TextInput
        style={[inputStyles.input, error && inputStyles.inputError, style]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text variant="error">{error}</Text>}
    </View>
  );
}
