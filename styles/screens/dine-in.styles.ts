import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createDineInStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  orderSummary: {
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
    marginTop: 8,
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
  durationSelector: {
    padding: 16,
    marginBottom: 16,
  },
  durationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  durationOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  durationButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
  },
  durationText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  durationTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  confirmButton: {
    width: '100%',
  },
});
