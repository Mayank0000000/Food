import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createMessageBubbleStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  bubbleWrapper: {
    maxWidth: '75%',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: theme.mode === 'light' ? '#F0F0F0' : theme.colors.card,
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: theme.mode === 'light' ? '#FEE' : 'rgba(239, 83, 80, 0.2)',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFF',
  },
  botText: {
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  userTimestamp: {
    color: theme.colors.textTertiary,
    textAlign: 'right',
  },
  botTimestamp: {
    color: theme.colors.textTertiary,
    textAlign: 'left',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  menuItemsContainer: {
    marginTop: 12,
    gap: 8,
  },
});
