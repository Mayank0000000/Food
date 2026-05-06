import { ChatInput } from '@/components/chat/chat-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { QuickReplies } from '@/components/chat/quick-replies';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { chatService } from '@/services/chat.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addMessage,
  clearMessages,
  loadMessagesFromStorage,
  sendMessage,
} from '@/store/slices/chatSlice';
import {
  setPendingCategory,
  setPendingFilters,
  setPendingSearchQuery,
} from '@/store/slices/explorerSlice';
import { createChatScreenStyles } from '@/styles/screens/chat.styles';
import { ChatMessage, QuickReply } from '@/types/chat.types';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHAT_STORAGE_KEY = '@chat_messages';

export default function ChatScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, colors } = useTheme();
  const chatScreenStyles = useMemo(() => createChatScreenStyles(theme), [theme]);
  const { messages, isLoading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const flatListRef = useRef<FlatList>(null);
  const [quickReplies] = useState<QuickReply[]>(chatService.getQuickReplies());

  useEffect(() => {
    loadChatHistory();
    
    // Send welcome message if no messages
    if (messages.length === 0) {
      sendWelcomeMessage();
    }
  }, []);

  useEffect(() => {
    // Save messages to storage whenever they change
    saveChatHistory();
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsedMessages: ChatMessage[] = JSON.parse(stored);
        dispatch(loadMessagesFromStorage(parsedMessages));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = async () => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const sendWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: `bot_welcome_${Date.now()}`,
      role: 'bot',
      content: `Hello${user ? ` ${user.name}` : ''}! 👋\n\nI'm your restaurant assistant. I can help you with:\n\n• Browsing the menu\n• Tracking orders\n• Booking tables\n• Checking offers\n• Answering questions\n\nHow can I assist you today?`,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(welcomeMessage));
  };

  const handleSendMessage = async (messageText: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(userMessage));

    // Send to chatbot
    const result = await dispatch(sendMessage({ message: messageText, userId: user?.id.toString() }));
    
    // Handle navigation action if present
    if (result.payload && typeof result.payload === 'object' && 'navigationAction' in result.payload) {
      const navigationAction = (result.payload as any).navigationAction;
      if (navigationAction) {
        handleNavigation(navigationAction);
      }
    }
  };

  const handleNavigation = (action: any) => {
    setTimeout(() => {
      switch (action.type) {
        case 'explorer':
          // Set filters in Redux before navigating
          if (action.params?.filters) {
            dispatch(setPendingFilters(action.params.filters));
          }
          if (action.params?.category) {
            dispatch(setPendingCategory(action.params.category));
          }
          if (action.params?.searchQuery) {
            dispatch(setPendingSearchQuery(action.params.searchQuery));
          }
          router.push('/(tabs)/explorer');
          break;
        case 'orders':
          router.push('/my-orders');
          break;
        case 'bookings':
          router.push('/my-bookings');
          break;
        case 'dine-in':
          router.push('/dine-in');
          break;
        case 'order-tracking':
          if (action.params?.orderId) {
            router.push(`/order-tracking?orderId=${action.params.orderId}`);
          }
          break;
      }
    }, 1000); // Small delay so user can see the message
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.action);
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearMessages());
            await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
            sendWelcomeMessage();
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  const renderEmptyState = () => (
    <RView style={chatScreenStyles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color={colors.border} />
      <Text style={chatScreenStyles.emptyText}>
        Start a conversation with our assistant
      </Text>
    </RView>
  );

  return (
    <SafeAreaView style={chatScreenStyles.container} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Customer Support"
        onBack={() => router.back()}
        rightComponent={
          <Button
            variant="outline"
            size="small"
            onPress={handleClearChat}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="trash-outline" size={16} color={colors.text} />
          </Button>
        }
      />

      <KeyboardAvoidingView
        style={chatScreenStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={chatScreenStyles.messagesList}
          ListEmptyComponent={renderEmptyState}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        {isLoading && <TypingIndicator />}

        <QuickReplies
          replies={quickReplies}
          onReplyPress={handleQuickReply}
          disabled={isLoading}
        />

        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Ask me anything..."
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
