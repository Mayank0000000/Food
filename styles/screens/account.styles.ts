import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createAccountStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.mode === 'dark' ? theme.colors.surface : '#1a1d2e',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    padding: 20,
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  menuArrow: {
    color: theme.colors.textSecondary,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  version: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
  },
});