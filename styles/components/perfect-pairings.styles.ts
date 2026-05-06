import { Theme } from '@/types/theme.types';
import { StyleSheet } from 'react-native';

export const createPerfectPairingsStyles = (theme: Theme) => StyleSheet.create({
  section: {
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 8,
  },
  scroll: {
    paddingRight: 16,
  },
  card: {
    marginRight: 12,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  menuButton: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
});
