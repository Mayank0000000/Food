import React from 'react';
import { GestureResponderEvent, Pressable, PressableProps, ViewStyle } from 'react-native';

interface PressableViewProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: (event?: GestureResponderEvent) => void;
}

export const PressableView: React.FC<PressableViewProps> = ({ 
  children, 
  style, 
  onPress,
  ...props 
}) => {
  return (
    <Pressable
      style={style}
      onPress={onPress}
      {...props}
    >
      {children}
    </Pressable>
  );
};
