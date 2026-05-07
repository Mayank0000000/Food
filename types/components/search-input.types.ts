import { TextInputProps, ViewStyle } from 'react-native';

export interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholders?: string[]; // Array of placeholders to rotate through
  placeholderInterval?: number; // Time in ms between placeholder changes (default: 3000)
  onClear?: () => void;
  style?: ViewStyle | ViewStyle[];
}
