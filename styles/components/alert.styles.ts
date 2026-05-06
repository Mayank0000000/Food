import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createAlertStyles = (theme: Theme) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  buttonSpacing: {
    marginRight: 0,
  },
  destructiveButton: {
    borderColor: theme.colors.error,
  },
  destructiveText: {
    color: theme.colors.error,
  },
});
