import { useTheme } from '@/hooks/useTheme';
import { ViewProps } from '@/types/components/rview.types';
import React from 'react';
import { View as RNView, ViewStyle } from 'react-native';

interface ThemedViewProps extends ViewProps {
  bg?: 'background' | 'surface' | 'card' | 'primary' | 'transparent';
}

export const RView = React.forwardRef<RNView, ThemedViewProps>(({ style, children, bg, ...props }, ref) => {
  const { colors } = useTheme();

  const backgroundColor = bg
    ? bg === 'transparent'
      ? 'transparent'
      : bg === 'primary'
      ? colors.primary
      : colors[bg]
    : undefined;

  const themedStyle: ViewStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <RNView ref={ref} style={[themedStyle, style]} {...props}>
      {children}
    </RNView>
  );
});

RView.displayName = 'RView';
