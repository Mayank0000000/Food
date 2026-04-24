import { StyleSheet } from 'react-native';

export const vegIndicatorStyles = StyleSheet.create({
  container: {
    marginRight: 6,
  },
  border: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegBorder: {
    borderColor: '#22C55E',
  },
  nonVegBorder: {
    borderColor: '#EF4444',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vegDot: {
    backgroundColor: '#22C55E',
  },
  nonVegDot: {
    backgroundColor: '#EF4444',
  },
});
