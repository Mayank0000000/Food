import { StyleSheet } from 'react-native';

export const couponBannerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  count: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
  },
});
