import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createTabStyles = (theme: Theme) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    backgroundColor: theme.colors.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 85,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.1,
    shadowRadius: 8,
    marginTop: -20,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});