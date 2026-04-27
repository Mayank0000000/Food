import { ViewProps } from '@/types/components/rview.types';
import React from 'react';
import { View as RNView } from 'react-native';

export const RView = React.forwardRef<RNView, ViewProps>(({ style, children, ...props }, ref) => {
  return (
    <RNView ref={ref} style={style} {...props}>
      {children}
    </RNView>
  );
});

RView.displayName = 'RView';
