import { ViewStyle } from 'react-native';

export interface EmptyStateProps {
  icon?: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  iconSize?: number;
  iconColor?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}
