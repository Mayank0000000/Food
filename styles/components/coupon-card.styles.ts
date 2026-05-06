import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createCouponCardStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  appliedContainer: {
    borderColor: theme.colors.success,
    backgroundColor: theme.mode === 'dark' ? theme.colors.success + '20' : '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  validUntil: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  appliedButton: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  appliedButtonText: {
    color: '#fff',
  },
  termsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  termsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  termBullet: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginRight: 6,
    marginTop: 2,
  },
  termText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
});
