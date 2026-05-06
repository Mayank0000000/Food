import { Theme } from '@/types/theme.types';
import { Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

export const createMenuItemDetailModalStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 280,
  },
  content: {
    padding: 20,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  spicyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '30' : '#FFE5DC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  spicyText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginRight: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 6,
  },
  reviews: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  prepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prepTime: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    padding: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginHorizontal: 16,
  },
  addButton: {
    flex: 1,
  },
});
