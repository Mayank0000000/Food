import React, { useMemo } from 'react';

import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { CATEGORY_IMAGES } from '@/constants';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createCategoryTabsStyles } from '@/styles/components/category-tabs.styles';
import { CategoryTabsProps } from '@/types/components/category-tabs.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, TouchableOpacity } from 'react-native';

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  itemCounts,
}) => {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createCategoryTabsStyles(theme), [theme]);

  const getCategoryDisplayName = (category: string) => {
    // If it's a CMS key (contains a dot), translate it
    if (category.includes('.')) {
      return t(category);
    }
    // Otherwise, it's a category name from menu data
    return category;
  };

  const getCategoryImage = (category: string) => {
    // For "All" category, return null (we'll show an icon instead)
    if (category.includes('allCategory')) {
      return null;
    }
    
    // Try to find image by exact match (case insensitive)
    const categoryLower = category.toLowerCase();
    const imageUrl = CATEGORY_IMAGES[categoryLower];
    
    if (imageUrl) {
      return imageUrl;
    }
    
    // Try partial match (e.g., "Main Course" might match "main")
    const partialMatch = Object.keys(CATEGORY_IMAGES).find(key => 
      categoryLower.includes(key) || key.includes(categoryLower)
    );
    
    if (partialMatch) {
      return CATEGORY_IMAGES[partialMatch];
    }
    
    // No match found
    return null;
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
          const categoryImage = getCategoryImage(category);
          const isAllCategory = category.includes('allCategory');
          
          return (
            <TouchableOpacity
              key={category}
              style={styles.categoryItem}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
            >
              {/* Category Image/Icon Circle */}
              <RView style={[
                styles.imageContainer,
                isSelected && styles.imageContainerActive,
              ]}>
                {categoryImage ? (
                  <Image
                    source={{ uri: categoryImage }}
                    style={styles.categoryImage}
                    contentFit="cover"
                  />
                ) : (
                  <Ionicons 
                    name={isAllCategory ? "grid-outline" : "restaurant-outline"} 
                    size={28} 
                    color={isSelected ? colors.primary : colors.textSecondary} 
                  />
                )}
                
                {/* Active indicator ring */}
                {isSelected && <RView style={styles.activeRing} />}
              </RView>
              
              {/* Category Name */}
              <Text
                variant="caption"
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextActive,
                ]}
                numberOfLines={1}
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
