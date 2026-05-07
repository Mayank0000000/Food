import { floatingChatButtonStyles } from '@/styles/components/floating-chat-button.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';

interface FloatingChatButtonProps {
  onPress?: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onPress }) => {
  const router = useRouter();
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(100)).current; // Start below screen
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim1 = useRef(new Animated.Value(0)).current;
  const rippleAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation - slide up from bottom
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ripple effect 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ripple effect 2 (delayed)
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rippleAnim2, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rippleAnim2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 1000);
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/chat');
    }
  };

  // Ripple styles
  const rippleStyle1 = {
    opacity: rippleAnim1.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
    transform: [
      {
        scale: rippleAnim1.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.8],
        }),
      },
    ],
  };

  const rippleStyle2 = {
    opacity: rippleAnim2.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
    transform: [
      {
        scale: rippleAnim2.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.8],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        floatingChatButtonStyles.wrapper,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Ripple effects */}
      <Animated.View
        style={[floatingChatButtonStyles.ripple, rippleStyle1]}
      />
      <Animated.View
        style={[floatingChatButtonStyles.ripple, rippleStyle2]}
      />

      {/* Main button */}
      <Animated.View
        style={{
          transform: [{ scale: Animated.multiply(pulseAnim, scaleAnim) }],
        }}
      >
        <TouchableOpacity
          style={floatingChatButtonStyles.container}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Ionicons name="chatbubbles" size={28} color="#fff" />
          
          {/* Notification badge (optional - can be used for unread messages) */}
          <View style={floatingChatButtonStyles.badge} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};
