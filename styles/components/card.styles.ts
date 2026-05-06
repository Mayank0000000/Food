import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createCardStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
