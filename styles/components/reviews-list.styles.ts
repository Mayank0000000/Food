import { StyleSheet } from 'react-native';

export const reviewsListStyles = StyleSheet.create({
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
    color: '#FF6B35',
  },
  totalReviews: {
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
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
    backgroundColor: '#FF6B35',
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
    color: '#666',
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
