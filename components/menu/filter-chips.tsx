import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createFilterChipsStyles } from '@/styles/components/filter-chips.styles';
import { FilterChipsProps } from '@/types/components/filter-chips.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

export const FilterChips: React.FC<FilterChipsProps> = ({ activeFilters, onOpenModal }) => {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createFilterChipsStyles(theme), [theme]);
  const hasActiveFilters = activeFilters.veg !== null ||
    activeFilters.hasOffers ||
    activeFilters.sortBy !== 'relevance' ||
    activeFilters.minRating !== null;

  return (
    <RView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            hasActiveFilters && styles.chipActive,
          ]}
          onPress={onOpenModal}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={hasActiveFilters ? colors.primary : colors.textSecondary}
          />
          <Text
            variant="caption"
            style={[
              styles.chipText,
              hasActiveFilters && styles.chipTextActive,
            ]}
          >
            {t('explorer.filters')}
          </Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={hasActiveFilters ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </ScrollView>
    </RView>
  );
};
