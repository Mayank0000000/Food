import { TextProps as RNTextProps } from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'error';
  color?: string;
  children: React.ReactNode;
}
