import { VegIndicator } from '@/components/menu/veg-indicator';
import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { reviewService } from '@/services/review.service';
import { menuItemCardStyles } from '@/styles/components/menu-item-card.styles';
import { MenuItemCardProps } from '@/types/components/menu-item-card.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress }) => {
  const [averageRating, setAverageRating] = useState('0.0');
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadStats();
  }, [item.id]);

  const loadStats = async () => {
    try {
      const stats = await reviewService.getMenuItemStats(item.id);
      setAverageRating(stats.averageRating.toFixed(1));
      setTotalReviews(stats.totalReviews);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

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
                ({totalReviews} Review)
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
