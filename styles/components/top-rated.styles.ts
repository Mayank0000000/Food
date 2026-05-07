import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createTopRatedStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      backgroundColor: theme.colors.card,
      padding: 16,
      marginBottom: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    titleText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    scroll: {
      gap: 12,
      paddingRight: 16,
    },
    card: {
      width: 160,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    image: {
      width: '100%',
      height: 120,
      backgroundColor: theme.colors.borderLight,
    },
    vegBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      padding: 4,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    ratingBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: theme.colors.success,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#fff',
    },
    info: {
      padding: 12,
    },
    itemName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    reviewsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    reviewsText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });
