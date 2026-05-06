import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createChatScreenStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 16,
  },
});
