import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createDateTimeSelectorStyles = (theme: Theme) => StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.mode === 'dark' ? theme.colors.card : '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  scrollView: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  optionItemSelected: {
    backgroundColor: theme.mode === 'dark' ? theme.colors.primary + '20' : '#FFF5F2',
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
