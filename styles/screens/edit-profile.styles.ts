import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createEditProfileStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 32,
      position: 'relative',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#fff',
    },
    editIconButton: {
      position: 'absolute',
      bottom: 0,
      right: '38%',
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formContainer: {
      gap: 24,
    },
    input: {
      marginBottom: 0,
    },
    buttonContainer: {
      padding: 20,
      paddingBottom: 20,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    updateButton: {
      marginBottom: 0,
    },
  });
