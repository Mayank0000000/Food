import { floatingChatButtonStyles } from '@/styles/components/floating-chat-button.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FloatingChatButtonProps {
  onPress?: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/chat');
    }
  };

  return (
    <TouchableOpacity
      style={floatingChatButtonStyles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons name="chatbubbles" size={28} color="#fff" />
    </TouchableOpacity>
  );
};
