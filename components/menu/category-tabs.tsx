import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
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
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <Text variant="caption" style={categoryTabsStyles.itemCount}>
        Total {itemCounts[selectedCategory] || 0} items
      </Text>
    </RView>
  );
};
