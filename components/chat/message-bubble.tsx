import { MenuItemChatCard } from '@/components/chat/menu-item-chat-card';
import { MenuItemDetailModal } from '@/components/menu/menu-item-detail-modal';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { createMessageBubbleStyles } from '@/styles/components/message-bubble.styles';
import { ChatMessage } from '@/types/chat.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { theme } = useTheme();
  const messageBubbleStyles = useMemo(() => createMessageBubbleStyles(theme), [theme]);
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Get menu items from Redux
  const menuItems = useAppSelector((state) => state.menu.items);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get menu items to display
  const itemsToDisplay = message.menuItems
    ? message.menuItems.map(id => menuItems.find(item => String(item.id) === id)).filter((item): item is NonNullable<typeof item> => item !== undefined)
    : [];

  const selectedItem = selectedItemId ? menuItems.find(item => String(item.id) === selectedItemId) : null;

  return (
    <>
      <RView
        style={[
          messageBubbleStyles.container,
          isUser ? messageBubbleStyles.userContainer : messageBubbleStyles.botContainer,
        ]}
      >
        {!isUser && (
          <RView style={messageBubbleStyles.botAvatar}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
          </RView>
        )}

        <RView style={messageBubbleStyles.bubbleWrapper}>
          <RView
            style={[
              messageBubbleStyles.bubble,
              isUser ? messageBubbleStyles.userBubble : messageBubbleStyles.botBubble,
              isError && messageBubbleStyles.errorBubble,
            ]}
          >
            <Text
              style={[
                messageBubbleStyles.messageText,
                isUser ? messageBubbleStyles.userText : messageBubbleStyles.botText,
              ]}
            >
              {message.content}
            </Text>
            
            {/* Display menu items if present */}
            {itemsToDisplay.length > 0 && (
              <RView style={messageBubbleStyles.menuItemsContainer}>
                {itemsToDisplay.map((item) => (
                  <MenuItemChatCard
                    key={item.id}
                    item={item}
                    onPress={() => setSelectedItemId(String(item.id))}
                  />
                ))}
              </RView>
            )}
          </RView>
          <Text
            style={[
              messageBubbleStyles.timestamp,
              isUser ? messageBubbleStyles.userTimestamp : messageBubbleStyles.botTimestamp,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
        </RView>

        {isUser && (
          <RView style={messageBubbleStyles.userAvatar}>
            <Ionicons name="person" size={20} color="#fff" />
          </RView>
        )}
      </RView>
      
      {/* Menu Item Detail Modal */}
      {selectedItem && (
        <MenuItemDetailModal
          item={selectedItem}
          visible={!!selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </>
  );
};
