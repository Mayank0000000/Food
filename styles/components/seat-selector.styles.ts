import { StyleSheet } from 'react-native';

export const seatSelectorStyles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#666',
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
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  seatDisabled: {
    opacity: 0.5,
  },
  seatSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
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
    color: '#333',
  },
  seatNumberDisabled: {
    color: '#999',
  },
  seatNumberSelected: {
    color: '#FF6B35',
  },
  seatTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  seatTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seatTypeText: {
    fontSize: 11,
    color: '#666',
  },
});
