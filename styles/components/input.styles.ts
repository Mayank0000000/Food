import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createInputStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: {
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
  },
});
