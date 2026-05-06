import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createChatInputStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.mode === 'light' ? '#F9F9F9' : theme.colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
});
