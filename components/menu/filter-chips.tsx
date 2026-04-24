import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { filterChipsStyles } from '@/styles/components/filter-chips.styles';
import { FilterChipsProps } from '@/types/components/filter-chips.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

export const FilterChips: React.FC<FilterChipsProps> = ({ activeFilters, onOpenModal }) => {
  const hasActiveFilters = activeFilters.veg !== null ||
    activeFilters.hasOffers ||
    activeFilters.sortBy !== 'relevance' ||
    activeFilters.minRating !== null;

  return (
    <RView style={filterChipsStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={filterChipsStyles.scrollContent}
      >
        <TouchableOpacity
          style={[
            filterChipsStyles.chip,
            hasActiveFilters && filterChipsStyles.chipActive,
          ]}
          onPress={onOpenModal}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={hasActiveFilters ? '#FF6B35' : '#666'}
          />
          <Text
            variant="caption"
            style={[
              filterChipsStyles.chipText,
              hasActiveFilters && filterChipsStyles.chipTextActive,
            ]}
          >
            Filters
          </Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={hasActiveFilters ? '#FF6B35' : '#666'}
          />
        </TouchableOpacity>
      </ScrollView>
    </RView>
  );
};
