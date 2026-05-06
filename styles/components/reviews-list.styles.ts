import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createReviewsListStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginTop: 16,
  },
  summarySection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  ratingBox: {
    alignItems: 'center',
    gap: 8,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  totalReviews: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  reviewsList: {
    gap: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewItem: {
    backgroundColor: theme.mode === 'light' ? '#F9F9F9' : theme.colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: theme.mode === 'dark' ? 1 : 0,
    borderColor: theme.mode === 'dark' ? theme.colors.border : 'transparent',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
});
