import { buttonStyles } from '@/styles/components/button.styles';
import { ButtonProps } from '@/types/components/button.types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from './text';

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'large',
  icon,
  iconPosition = 'left',
  children,
  style, 
  ...props 
}: ButtonProps) {
  // If children are provided, render them directly
  if (children) {
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
        {children}
      </TouchableOpacity>
    );
  }

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
      {icon && iconPosition === 'left' && (
        <View style={buttonStyles.iconContainer}>{icon}</View>
      )}
      {title && (
        <Text style={[buttonStyles.text, buttonStyles[`${variant}Text`]]}>{title}</Text>
      )}
      {icon && iconPosition === 'right' && (
        <View style={buttonStyles.iconContainer}>{icon}</View>
      )}
    </TouchableOpacity>
  );
}
