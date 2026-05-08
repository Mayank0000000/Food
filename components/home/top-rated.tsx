import { VegIndicator } from '@/components/menu/veg-indicator';
import { RView } from '@/components/ui/rview';
import { PairingSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { reviewService } from '@/services/review.service';
import { createTopRatedStyles } from '@/styles/components/top-rated.styles';
import { MenuItem } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

interface TopRatedProps {
  items: MenuItem[];
  isLoading: boolean;
  onItemPress?: (item: MenuItem) => void;
}

interface MenuItemWithRating extends MenuItem {
  averageRating: number;
  totalReviews: number;
}

export const TopRated: React.FC<TopRatedProps> = ({ items, isLoading, onItemPress }) => {
  const { t } = useCMS();
  const router = useRouter();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createTopRatedStyles(theme), [theme]);
  const [topRatedItems, setTopRatedItems] = useState<MenuItemWithRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopRatedItems();
  }, [items]);

  const loadTopRatedItems = async () => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch ratings for all items
      const itemsWithRatings = await Promise.all(
        items.map(async (item) => {
          const stats = await reviewService.getMenuItemStats(item.id);
          return {
            ...item,
            averageRating: stats.averageRating,
            totalReviews: stats.totalReviews,
          };
        })
      );

      // Filter items with rating > 3.5 and at least 1 review
      const filtered = itemsWithRatings.filter(
        (item) => item.averageRating > 3.5 && item.totalReviews > 0
      );

      // Sort by rating (descending), then by total reviews
      const sorted = filtered.sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.totalReviews - a.totalReviews;
      });

      // Take top 6 items
      setTopRatedItems(sorted.slice(0, 6));
    } catch (error) {
      console.error('Error loading top rated items:', error);
      setTopRatedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: MenuItemWithRating) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  const handleViewAll = () => {
    router.push('/(tabs)/explorer');
  };

  // Don't render if no top rated items
  if (!loading && topRatedItems.length === 0) {
    return null;
  }

  return (
    <RView style={styles.section}>
      <RView style={styles.header}>
        <RView style={styles.titleContainer}>
          <Ionicons name="star" size={22} color={colors.warning} />
          <Text variant="subtitle" style={styles.titleText}>
            {t('home.topRatedTitle')}
          </Text>
        </RView>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Text variant="caption" style={styles.viewAllText}>
            {t('home.viewAll')}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </RView>

      {loading || isLoading ? (
        <PairingSkeleton count={3} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {topRatedItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleItemPress(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
              />
              
              {/* Veg Indicator Badge */}
              <RView style={styles.vegBadge}>
                <VegIndicator isVeg={item.veg} />
              </RView>

              {/* Rating Badge */}
              <RView style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#fff" />
                <Text variant="caption" style={styles.ratingText}>
                  {item.averageRating.toFixed(1)}
                </Text>
              </RView>

              <RView style={styles.info}>
                <Text variant="body" style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <RView style={styles.priceRow}>
                  <Text variant="subtitle" style={styles.price}>
                    ₹{item.price}
                  </Text>
                  <RView style={styles.reviewsContainer}>
                    <Ionicons name="chatbubble-outline" size={12} color={colors.textSecondary} />
                    <Text variant="caption" style={styles.reviewsText}>
                      {item.totalReviews}
                    </Text>
                  </RView>
                </RView>
              </RView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </RView>
  );
};
