import { StyleSheet } from 'react-native';

export const couponCardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
  },
  appliedContainer: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
    marginLeft: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  validUntil: {
    fontSize: 12,
    color: '#999',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  appliedButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  appliedButtonText: {
    color: '#fff',
  },
  termsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  termsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  termBullet: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
    marginTop: 2,
  },
  termText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
});
