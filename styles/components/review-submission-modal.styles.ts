import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createReviewSubmissionModalStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
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
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  itemName: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  ratingSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  feedbackSection: {
    marginBottom: 16,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    color: theme.colors.text,
    backgroundColor: theme.colors.inputBackground,
  },
  footer: {
    paddingHorizontal: 20,
  },
  submitButton: {
    width: '100%',
  },
});
