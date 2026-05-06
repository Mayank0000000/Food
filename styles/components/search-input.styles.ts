import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createSearchInputStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.mode === 'dark' ? theme.colors.card : '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  iconButton: {
    padding: 4,
  },
});
