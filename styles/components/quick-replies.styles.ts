import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createQuickRepliesStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  replyButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  replyButtonDisabled: {
    opacity: 0.5,
  },
  replyText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
