import { RView } from '@/components/ui/rview';
import { vegIndicatorStyles } from '@/styles/components/veg-indicator.styles';
import React from 'react';

interface VegIndicatorProps {
  isVeg: boolean;
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ isVeg }) => {
  return (
    <RView style={vegIndicatorStyles.container}>
      <RView style={[
        vegIndicatorStyles.border,
        isVeg ? vegIndicatorStyles.vegBorder : vegIndicatorStyles.nonVegBorder
      ]}>
        <RView style={[
          vegIndicatorStyles.dot,
          isVeg ? vegIndicatorStyles.vegDot : vegIndicatorStyles.nonVegDot
        ]} />
      </RView>
    </RView>
  );
};
