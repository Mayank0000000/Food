import { ViewProps as RNViewProps, StyleProp, ViewStyle } from 'react-native';

export interface ViewProps extends RNViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
}
