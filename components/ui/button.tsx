import { buttonStyles } from '@/styles/components/button.styles';
import { ButtonProps } from '@/types/components/button.types';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from './text';

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'large',
  style, 
  ...props 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        buttonStyles.button,
        buttonStyles[variant],
        buttonStyles[size],
        style,
      ]}
      {...props}
    >
      <Text style={[buttonStyles.text, buttonStyles[`${variant}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
}
