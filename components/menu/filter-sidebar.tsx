import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createFilterModalStyles } from '@/styles/components/filter-modal.styles';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

type FilterSection = 'sortBy' | 'rating' | 'offers' | 'foodType';

interface FilterSidebarProps {
  activeSection: FilterSection;
  onSectionChange: (section: FilterSection) => void;
}

const sidebarItems = [
  { id: 'sortBy' as const, icon: 'swap-vertical-outline', label: 'Sort By' },
  { id: 'rating' as const, icon: 'star-outline', label: 'Rating' },
  { id: 'offers' as const, icon: 'pricetag-outline', label: 'Offers' },
  { id: 'foodType' as const, icon: 'leaf-outline', label: 'Food Type' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ activeSection, onSectionChange }) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createFilterModalStyles(theme), [theme]);

  return (
    <RView style={styles.sidebar}>
      {sidebarItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <TouchableOpacity 
            key={item.id}
            style={styles.sidebarItem}
            onPress={() => onSectionChange(item.id)}
          >
            {isActive && <RView style={styles.activeIndicator} />}
            <Ionicons 
              name={item.icon as any}
              size={20} 
              color={isActive ? colors.primary : colors.textSecondary} 
            />
            <Text 
              variant="caption" 
              style={[
                styles.sidebarText,
                isActive && styles.sidebarTextActive
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </RView>
  );
};
