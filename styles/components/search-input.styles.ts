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
  inputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    height: 24, // Fixed height to prevent layout shifts
    overflow: 'hidden', // Hide text that slides out
  },
  placeholderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    overflow: 'hidden', // Critical: hides placeholders that are outside view
  },
  placeholderItem: {
    height: 24,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: theme.colors.text,
    padding: 0,
    margin: 0,
    height: 24,
  },
  animatedPlaceholder: {
    fontSize: 16,
    pointerEvents: 'none',
  },
  iconButton: {
    padding: 4,
  },
});
