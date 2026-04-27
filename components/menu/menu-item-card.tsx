import { VegIndicator } from '@/components/menu/veg-indicator';
import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { menuItemCardStyles } from '@/styles/components/menu-item-card.styles';
import { MenuItemCardProps } from '@/types/components/menu-item-card.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress }) => {
  const averageRating = item.rating.length > 0 
    ? (item.rating.reduce((a, b) => a + b, 0) / item.rating.length).toFixed(1)
    : '0.0';

  return (
    <PressableView onPress={onPress}>
      <Card style={menuItemCardStyles.container}>
        <Image 
          source={{ uri: item.image }}
          style={menuItemCardStyles.image}
          contentFit="cover"
        />
        
        <RView style={menuItemCardStyles.content}>
          <RView style={menuItemCardStyles.header}>
            <Text variant="subtitle" style={menuItemCardStyles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <VegIndicator isVeg={item.veg} />
          </RView>

          <RView style={menuItemCardStyles.categoryBadge}>
            <Text variant="caption" style={menuItemCardStyles.categoryText}>
              {item.category}
            </Text>
          </RView>

          <RView style={menuItemCardStyles.footer}>
            <RView style={menuItemCardStyles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FF6B35" />
              <Text variant="caption" style={menuItemCardStyles.rating}>
                {averageRating}
              </Text>
              <Text variant="caption" style={menuItemCardStyles.reviews}>
                ({item.reviews} Review)
              </Text>
            </RView>
          </RView>

          <RView style={menuItemCardStyles.priceRow}>
            <Text variant="subtitle" style={menuItemCardStyles.price}>
              ₹{item.price}
            </Text>
          </RView>
        </RView>
      </Card>
    </PressableView>
  );
};
