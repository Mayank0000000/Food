import { StyleSheet } from 'react-native';

export const categoryTabsStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
