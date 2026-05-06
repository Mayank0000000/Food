import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createCategoryTabsStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
