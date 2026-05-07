import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createCategoryTabsStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  imageContainerActive: {
    borderColor: theme.colors.primary,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  activeRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  itemCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  
  // Legacy styles (keeping for backward compatibility)
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
});
