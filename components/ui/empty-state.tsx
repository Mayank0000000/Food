import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { emptyStateStyles } from '@/styles/components/empty-state.styles';
import { EmptyStateProps } from '@/types/components/empty-state.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'alert-circle-outline',
  iconSize = 80,
  iconColor = '#ccc',
  title,
  subtitle,
  action,
  style,
}) => {
  return (
    <RView style={[emptyStateStyles.container, style]}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text variant="subtitle" style={emptyStateStyles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" style={emptyStateStyles.subtitle}>
          {subtitle}
        </Text>
      )}
      {action && (
        <RView style={emptyStateStyles.actionContainer}>
          {action}
        </RView>
      )}
    </RView>
  );
};
