import { buttonStyles } from '@/styles/components/button.styles';
import { ButtonProps } from '@/types/components/button.types';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Text } from './text';

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'large',
  icon,
  iconPosition = 'left',
  children,
  loading = false,
  disabled,
  textStyle,
  style, 
  ...props 
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // If children are provided, render them directly
  if (children) {
    return (
      <TouchableOpacity
        style={[
          buttonStyles.button,
          buttonStyles[variant],
          buttonStyles[size],
          isDisabled && buttonStyles.disabled,
          style,
        ]}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' ? '#EF4444' : '#fff'} 
            size="small" 
          />
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        buttonStyles.button,
        buttonStyles[variant],
        buttonStyles[size],
        isDisabled && buttonStyles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#EF4444' : '#fff'} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={buttonStyles.iconContainer}>{icon}</View>
          )}
          {title && (
            <Text style={[buttonStyles.text, buttonStyles[`${variant}Text`], textStyle]}>{title}</Text>
          )}
          {icon && iconPosition === 'right' && (
            <View style={buttonStyles.iconContainer}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
