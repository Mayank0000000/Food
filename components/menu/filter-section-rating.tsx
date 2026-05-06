import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createFilterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionRatingProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionRating: React.FC<FilterSectionRatingProps> = ({ filters, onUpdate }) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createFilterModalStyles(theme), [theme]);
  const ratingOptions = [
    { value: 3.5, label: 'Rated 3.5+' },
    { value: 4.0, label: 'Rated 4.0+' },
  ];

  return (
    <RView style={styles.section}>
      <Text variant="subtitle" style={styles.sectionTitle}>
        Restaurant Rating
      </Text>
      <RView style={styles.optionGrid}>
        {ratingOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              filters.minRating === option.value && styles.optionCardActive,
            ]}
            onPress={() => onUpdate({ 
              ...filters, 
              minRating: filters.minRating === option.value ? null : option.value 
            })}
          >
            <Ionicons name="star" size={20} color={colors.success} />
            <Text variant="body" style={styles.optionText}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RView>
    </RView>
  );
};
