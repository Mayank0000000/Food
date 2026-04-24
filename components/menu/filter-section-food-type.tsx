import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { filterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionFoodTypeProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionFoodType: React.FC<FilterSectionFoodTypeProps> = ({ filters, onUpdate }) => {
  const foodTypes = [
    { value: true, label: 'Veg', icon: 'leaf', color: '#22C55E' },
    { value: false, label: 'Non-Veg', icon: 'restaurant', color: '#EF4444' },
  ];

  return (
    <RView style={filterModalStyles.section}>
      <Text variant="subtitle" style={filterModalStyles.sectionTitle}>
        Food Type
      </Text>
      <RView style={filterModalStyles.optionGrid}>
        {foodTypes.map((type) => (
          <TouchableOpacity
            key={type.label}
            style={[
              filterModalStyles.optionCard,
              filters.veg === type.value && filterModalStyles.optionCardActive,
            ]}
            onPress={() => onUpdate({ 
              ...filters, 
              veg: filters.veg === type.value ? null : type.value 
            })}
          >
            <Ionicons name={type.icon as any} size={20} color={type.color} />
            <Text variant="body" style={filterModalStyles.optionText}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RView>
    </RView>
  );
};
