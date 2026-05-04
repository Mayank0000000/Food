import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { categoryTabsStyles } from '@/styles/components/category-tabs.styles';
import { CategoryTabsProps } from '@/types/components/category-tabs.types';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  itemCounts,
}) => {
  const { t } = useCMS();

  const getCategoryDisplayName = (category: string) => {
    // If it's a CMS key (contains a dot), translate it
    if (category.includes('.')) {
      return t(category);
    }
    // Otherwise, it's a category name from menu data
    return category;
  };

  return (
    <RView style={categoryTabsStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={categoryTabsStyles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[
                categoryTabsStyles.tab,
                isSelected && categoryTabsStyles.tabActive,
              ]}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                variant="body"
                style={[
                  categoryTabsStyles.tabText,
                  isSelected && categoryTabsStyles.tabTextActive,
                ]}
              >
                {getCategoryDisplayName(category)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <Text variant="caption" style={categoryTabsStyles.itemCount}>
        {t('explorer.totalItems', { count: (itemCounts[selectedCategory] || 0).toString() })}
      </Text>
    </RView>
  );
};
