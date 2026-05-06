import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createCouponBannerStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF7ED',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  count: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  chevron: {
    marginLeft: 8,
  },
});
