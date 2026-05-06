import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createNotificationsStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  unreadItem: {
    backgroundColor: theme.colors.cardHover,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  body: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
});
