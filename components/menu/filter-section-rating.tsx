import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { filterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionRatingProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionRating: React.FC<FilterSectionRatingProps> = ({ filters, onUpdate }) => {
  const ratingOptions = [
    { value: 3.5, label: 'Rated 3.5+' },
    { value: 4.0, label: 'Rated 4.0+' },
  ];

  return (
    <RView style={filterModalStyles.section}>
      <Text variant="subtitle" style={filterModalStyles.sectionTitle}>
        Restaurant Rating
      </Text>
      <RView style={filterModalStyles.optionGrid}>
        {ratingOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              filterModalStyles.optionCard,
              filters.minRating === option.value && filterModalStyles.optionCardActive,
            ]}
            onPress={() => onUpdate({ 
              ...filters, 
              minRating: filters.minRating === option.value ? null : option.value 
            })}
          >
            <Ionicons name="star" size={20} color="#22C55E" />
            <Text variant="body" style={filterModalStyles.optionText}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RView>
    </RView>
  );
};
