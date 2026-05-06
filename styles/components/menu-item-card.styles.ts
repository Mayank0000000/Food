import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createMenuItemCardStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 120,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '30' : '#FFE5DC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
