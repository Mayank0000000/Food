import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createFilterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalState } from '@/types/components/filter-modal.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterSectionFoodTypeProps {
  filters: FilterModalState;
  onUpdate: (filters: FilterModalState) => void;
}

export const FilterSectionFoodType: React.FC<FilterSectionFoodTypeProps> = ({ filters, onUpdate }) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createFilterModalStyles(theme), [theme]);
  const foodTypes = [
    { value: true, label: 'Veg', icon: 'leaf', color: colors.success },
    { value: false, label: 'Non-Veg', icon: 'restaurant', color: colors.error },
  ];

  return (
    <RView style={styles.section}>
      <Text variant="subtitle" style={styles.sectionTitle}>
        Food Type
      </Text>
      <RView style={styles.optionGrid}>
        {foodTypes.map((type) => (
          <TouchableOpacity
            key={type.label}
            style={[
              styles.optionCard,
              filters.veg === type.value && styles.optionCardActive,
            ]}
            onPress={() => onUpdate({ 
              ...filters, 
              veg: filters.veg === type.value ? null : type.value 
            })}
          >
            <Ionicons name={type.icon as any} size={20} color={type.color} />
            <Text variant="body" style={styles.optionText}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RView>
    </RView>
  );
};
