import { Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const filterModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 90,
    backgroundColor: '#F8F8F8',
    paddingVertical: 20,
    position: 'relative',
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#FF6B35',
  },
  sidebarText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  sidebarTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectedOption: {
    fontSize: 14,
    color: '#FF6B35',
    flex: 1,
    textAlign: 'right',
  },
  sortOptions: {
    gap: 8,
  },
  sortOptionCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  sortOptionCardActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  optionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  optionCardActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  offerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  offerOptionActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  offerText: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerButton: {
    flex: 1,
  },
});
