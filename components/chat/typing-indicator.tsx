import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createTypingIndicatorStyles } from '@/styles/components/typing-indicator.styles';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

export const TypingIndicator: React.FC = () => {
  const { theme } = useTheme();
  const typingIndicatorStyles = useMemo(() => createTypingIndicatorStyles(theme), [theme]);
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  const animatedStyle = (dot: Animated.Value) => ({
    opacity: dot,
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
    ],
  });

  return (
    <RView style={typingIndicatorStyles.container}>
      <RView style={typingIndicatorStyles.botAvatar}>
        <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
      </RView>
      <RView style={typingIndicatorStyles.bubble}>
        <RView style={typingIndicatorStyles.dotsContainer}>
          <Animated.View style={[typingIndicatorStyles.dot, animatedStyle(dot1)]} />
          <Animated.View style={[typingIndicatorStyles.dot, animatedStyle(dot2)]} />
          <Animated.View style={[typingIndicatorStyles.dot, animatedStyle(dot3)]} />
        </RView>
        <Text style={typingIndicatorStyles.text}>Bot is typing...</Text>
      </RView>
    </RView>
  );
};
