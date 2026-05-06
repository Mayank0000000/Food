import { Theme } from '@/types/theme.types';
import { Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createPaymentMethodModalStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  methodCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cardHover,
  },
  methodCardDisabled: {
    opacity: 0.5,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.cardHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
