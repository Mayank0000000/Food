import { ViewProps as RNViewProps, ViewStyle } from 'react-native';

export interface ViewProps extends RNViewProps {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  onPress?: () => void;
}
