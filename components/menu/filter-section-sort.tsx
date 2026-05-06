import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createFilterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionSortProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionSort: React.FC<FilterSectionSortProps> = ({ filters, onUpdate }) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createFilterModalStyles(theme), [theme]);
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
    <RView style={styles.section}>
      <RView style={styles.sectionHeader}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Sort by
        </Text>
        <Text variant="caption" style={styles.selectedOption}>
          {getSortLabel()}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.primary} />
      </RView>
      
      <RView style={styles.sortOptions}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sortOptionCard,
              filters.sortBy === option.value && styles.sortOptionCardActive,
            ]}
            onPress={() => onUpdate({ ...filters, sortBy: option.value })}
          >
            <Text variant="body" style={styles.sortOptionText}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RView>
    </RView>
  );
};
