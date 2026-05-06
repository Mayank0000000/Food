import { useTheme } from '@/hooks/useTheme';
import { textStyles } from '@/styles/components/text.styles';
import { TextProps } from '@/types/components/text.types';
import React from 'react';
import { Text as RNText } from 'react-native';

export function Text({ 
  variant = 'body', 
  color,
  style, 
  children,
  ...props 
}: TextProps) {
  const { colors } = useTheme();
  
  // Default text color based on theme
  const defaultColor = colors.text;
  
  return (
    <RNText
      style={[
        textStyles.base,
        textStyles[variant],
        { color: color || defaultColor },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
