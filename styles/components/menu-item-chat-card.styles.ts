import { StyleSheet } from 'react-native';

export const menuItemChatCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  vegBadge: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegBadgeGreen: {
    borderColor: '#4CAF50',
  },
  vegBadgeRed: {
    borderColor: '#F44336',
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  vegDotGreen: {
    backgroundColor: '#4CAF50',
  },
  vegDotRed: {
    backgroundColor: '#F44336',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  category: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});
