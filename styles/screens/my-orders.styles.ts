import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createMyOrdersStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    padding: 0,
  },
  clearButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: theme.colors.background,
  },
  headerInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  restaurantLocation: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  viewMenu: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsSection: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
    marginRight: 6,
    marginLeft: 2,
  },
  itemName: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'column',
    gap: 12,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  reorderButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
