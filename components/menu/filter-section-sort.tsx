import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { filterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionSortProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionSort: React.FC<FilterSectionSortProps> = ({ filters, onUpdate }) => {
  const getSortLabel = () => {
    switch (filters.sortBy) {
      case 'priceLowToHigh': return 'Price: Low to High';
      case 'priceHighToLow': return 'Price: High to Low';
      case 'rating': return 'Rating';
      default: return 'Relevance';
    }
  };

  const sortOptions = [
    { value: 'relevance' as const, label: 'Relevance' },
    { value: 'priceLowToHigh' as const, label: 'Price: Low to High' },
    { value: 'priceHighToLow' as const, label: 'Price: High to Low' },
    { value: 'rating' as const, label: 'Rating' },
  ];

  return (
    <RView style={filterModalStyles.section}>
      <RView style={filterModalStyles.sectionHeader}>
        <Text variant="subtitle" style={filterModalStyles.sectionTitle}>
          Sort by
        </Text>
        <Text variant="caption" style={filterModalStyles.selectedOption}>
          {getSortLabel()}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#FF6B35" />
      </RView>
      
      <RView style={filterModalStyles.sortOptions}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              filterModalStyles.sortOptionCard,
              filters.sortBy === option.value && filterModalStyles.sortOptionCardActive,
            ]}
            onPress={() => onUpdate({ ...filters, sortBy: option.value })}
          >
            <Text variant="body" style={filterModalStyles.sortOptionText}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RView>
    </RView>
  );
};
