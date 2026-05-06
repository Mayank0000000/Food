import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createCartStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  listContent: {
    padding: 16,
  },
  couponSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.background,
  },
  billContainer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  billValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  discountLabel: {
    color: theme.colors.success,
  },
  discountValue: {
    color: theme.colors.success,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  ctaContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  ctaButton: {
    flex: 1,
  },
});