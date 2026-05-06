import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createFilterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionOffersProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionOffers: React.FC<FilterSectionOffersProps> = ({ filters, onUpdate }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createFilterModalStyles(theme), [theme]);
  return (
    <RView style={styles.section}>
      <Text variant="subtitle" style={styles.sectionTitle}>
        Offers
      </Text>
      <TouchableOpacity
        style={[
          styles.offerOption,
          filters.hasOffers && styles.offerOptionActive,
        ]}
        onPress={() => onUpdate({ ...filters, hasOffers: !filters.hasOffers })}
      >
        <Text variant="body" style={styles.offerText}>
          Deals and Discounts
        </Text>
      </TouchableOpacity>
    </RView>
  );
};
