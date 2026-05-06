import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createSeatSelectorStyles = (theme: Theme) => StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  seatButton: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: theme.mode === 'dark' ? theme.colors.card : '#f9f9f9',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  seatDisabled: {
    opacity: 0.5,
  },
  seatSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
  },
  seatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  seatNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  seatNumberDisabled: {
    color: theme.colors.textTertiary,
  },
  seatNumberSelected: {
    color: theme.colors.primary,
  },
  seatTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  seatTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seatTypeText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
