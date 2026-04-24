import { ViewProps } from '@/types/components/rview.types';
import React from 'react';
import { View as RNView } from 'react-native';

export const RView: React.FC<ViewProps> = ({ style, children, ...props }) => {
  return (
    <RNView style={style} {...props}>
      {children}
    </RNView>
  );
};
