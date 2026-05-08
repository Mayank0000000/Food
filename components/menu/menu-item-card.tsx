import { VegIndicator } from '@/components/menu/veg-indicator';
import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { reviewService } from '@/services/review.service';
import { createMenuItemCardStyles } from '@/styles/components/menu-item-card.styles';
import { MenuItemCardProps } from '@/types/components/menu-item-card.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onPress, 
  onRemove, 
  showRemoveButton = false 
}) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createMenuItemCardStyles(theme), [theme]);
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
      <Card style={styles.container}>
        <Image 
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
        />
        
        <RView style={styles.content}>
          <RView style={styles.header}>
            <Text variant="subtitle" style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <VegIndicator isVeg={item.veg} />
          </RView>

          <RView style={styles.categoryBadge}>
            <Text variant="caption" style={styles.categoryText}>
              {item.category}
            </Text>
          </RView>

          <RView style={styles.footer}>
            <RView style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FF6B35" />
              <Text variant="caption" style={styles.rating}>
                {averageRating}
              </Text>
              <Text variant="caption" style={styles.reviews}>
                ({totalReviews} Review)
              </Text>
            </RView>
          </RView>

          <RView style={styles.priceRow}>
            <Text variant="subtitle" style={styles.price}>
              ₹{item.price}
            </Text>
          </RView>
        </RView>

        {/* Remove Button - Only shown when showRemoveButton is true */}
        {showRemoveButton && onRemove && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </Card>
    </PressableView>
  );
};
