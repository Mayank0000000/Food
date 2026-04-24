import { RView } from '@/components/ui/rview';
import { cardStyles } from '@/styles/components/card.styles';
import { CardProps } from '@/types/components/card.types';
import React from 'react';

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <RView style={[cardStyles.container, style]}>
      {children}
    </RView>
  );
};
