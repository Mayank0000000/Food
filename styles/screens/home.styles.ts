import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createHomeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.mode === 'dark' ? '#1A3A1A' : '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  trustText: {
    fontSize: 13,
    color: theme.colors.success,
    marginLeft: 8,
    fontWeight: '500',
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.mode === 'dark' ? '#3A2A1A' : '#FFF7ED',
    padding: 12,
    borderRadius: 8,
  },
  offerText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  offerCount: {
    fontSize: 12,
    color: theme.colors.primary,
    marginRight: 4,
  },
  pairingsSection: {
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 8,
  },
  pairingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pairingsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pairingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 8,
  },
  loader: {
    marginVertical: 20,
  },
  pairingsScroll: {
    paddingRight: 16,
  },
  pairingCard: {
    marginRight: 12,
  },
  pairingImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  menuButton: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  deliveryOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
  },
  goldText: {
    fontWeight: '700',
    color: '#FFD700',
  },
});
