import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createTypingIndicatorStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
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
  bubble: {
    backgroundColor: theme.mode === 'light' ? '#F0F0F0' : theme.colors.card,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textTertiary,
  },
  text: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
});
