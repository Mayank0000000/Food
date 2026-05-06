import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createLanguageSelectorStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  content: {
    padding: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.mode === 'light' ? '#F9F9F9' : theme.colors.card,
    marginBottom: 12,
  },
  languageItemSelected: {
    backgroundColor: theme.mode === 'light' ? '#FFF5F0' : 'rgba(255, 107, 53, 0.15)',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
