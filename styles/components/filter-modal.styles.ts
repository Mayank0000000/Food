import { Theme } from '@/types/theme.types';
import { Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createFilterModalStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.surface,
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
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  clearText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 90,
    backgroundColor: theme.mode === 'dark' ? theme.colors.background : '#F8F8F8',
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
    backgroundColor: theme.colors.primary,
  },
  sidebarText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  sidebarTextActive: {
    color: theme.colors.primary,
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
    color: theme.colors.text,
    marginBottom: 12,
  },
  selectedOption: {
    fontSize: 14,
    color: theme.colors.primary,
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
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  sortOptionCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
  },
  sortOptionText: {
    fontSize: 14,
    color: theme.colors.text,
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
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  optionCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
  },
  optionText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  offerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  offerOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
  },
  offerText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    flex: 1,
  },
});
