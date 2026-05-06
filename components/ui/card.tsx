import { RView } from '@/components/ui/rview';
import { useTheme } from '@/hooks/useTheme';
import { createCardStyles } from '@/styles/components/card.styles';
import { CardProps } from '@/types/components/card.types';
import React, { useMemo } from 'react';

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createCardStyles(theme), [theme]);

  return (
    <RView style={[styles.container, style]}>
      {children}
    </RView>
  );
};
