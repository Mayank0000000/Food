import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { filterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionOffersProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionOffers: React.FC<FilterSectionOffersProps> = ({ filters, onUpdate }) => {
  return (
    <RView style={filterModalStyles.section}>
      <Text variant="subtitle" style={filterModalStyles.sectionTitle}>
        Offers
      </Text>
      <TouchableOpacity
        style={[
          filterModalStyles.offerOption,
          filters.hasOffers && filterModalStyles.offerOptionActive,
        ]}
        onPress={() => onUpdate({ ...filters, hasOffers: !filters.hasOffers })}
      >
        <Text variant="body" style={filterModalStyles.offerText}>
          Deals and Discounts
        </Text>
      </TouchableOpacity>
    </RView>
  );
};
