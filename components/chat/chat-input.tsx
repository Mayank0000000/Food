import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { useTheme } from '@/hooks/useTheme';
import { createChatInputStyles } from '@/styles/components/chat-input.styles';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { TextInput } from 'react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const { theme, colors } = useTheme();
  const chatInputStyles = useMemo(() => createChatInputStyles(theme), [theme]);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <RView style={chatInputStyles.container}>
      <RView style={chatInputStyles.inputWrapper}>
        <TextInput
          style={chatInputStyles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={500}
          editable={!disabled}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <PressableView
          onPress={handleSend}
          style={[
            chatInputStyles.sendButton,
            (!message.trim() || disabled) && chatInputStyles.sendButtonDisabled,
          ]}
          disabled={!message.trim() || disabled}
        >
          <Ionicons
            name="send"
            size={20}
            color={!message.trim() || disabled ? colors.textTertiary : '#FFF'}
          />
        </PressableView>
      </RView>
    </RView>
  );
};
