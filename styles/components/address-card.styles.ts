import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createAddressCardStyles = (theme: Theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  label: {
    fontWeight: '600',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 11,
  },
  addressLine: {
    color: theme.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  landmark: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  setDefaultButton: {
    marginTop: 12,
  },
});
