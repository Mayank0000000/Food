import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createQuickRepliesStyles } from '@/styles/components/quick-replies.styles';
import { QuickReply } from '@/types/chat.types';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';

interface QuickRepliesProps {
  replies: QuickReply[];
  onReplyPress: (reply: QuickReply) => void;
  disabled?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  replies,
  onReplyPress,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const quickRepliesStyles = useMemo(() => createQuickRepliesStyles(theme), [theme]);
  
  return (
    <RView style={quickRepliesStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={quickRepliesStyles.scrollContent}
      >
        {replies.map((reply) => (
          <PressableView
            key={reply.id}
            onPress={() => !disabled && onReplyPress(reply)}
            style={[
              quickRepliesStyles.replyButton,
              disabled && quickRepliesStyles.replyButtonDisabled,
            ]}
          >
            <Text style={quickRepliesStyles.replyText}>{reply.label}</Text>
          </PressableView>
        ))}
      </ScrollView>
    </RView>
  );
};
