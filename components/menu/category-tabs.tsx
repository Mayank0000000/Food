import React, { useMemo } from 'react';

import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createCategoryTabsStyles } from '@/styles/components/category-tabs.styles';
import { CategoryTabsProps } from '@/types/components/category-tabs.types';
import { ScrollView, TouchableOpacity } from 'react-native';

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  itemCounts,
}) => {
  const { t } = useCMS();
  const { theme } = useTheme();
  const styles = useMemo(() => createCategoryTabsStyles(theme), [theme]);

  const getCategoryDisplayName = (category: string) => {
    // If it's a CMS key (contains a dot), translate it
    if (category.includes('.')) {
      return t(category);
    }
    // Otherwise, it's a category name from menu data
    return category;
  };

  return (
    <RView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                isSelected && styles.tabActive,
              ]}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                variant="body"
                style={[
                  styles.tabText,
                  isSelected && styles.tabTextActive,
                ]}
              >
                {getCategoryDisplayName(category)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <Text variant="caption" style={styles.itemCount}>
        {t('explorer.totalItems', { count: (itemCounts[selectedCategory] || 0).toString() })}
      </Text>
    </RView>
  );
};
