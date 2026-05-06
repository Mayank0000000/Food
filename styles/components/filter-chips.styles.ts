import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createFilterChipsStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    gap: 6,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
  },
  chipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: theme.colors.primary,
  },
  sortMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 8,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1000,
    minWidth: 200,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  sortOptionText: {
    fontSize: 14,
    color: theme.colors.text,
  },
});
