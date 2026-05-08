import { VegIndicator } from '@/components/menu/veg-indicator';
import { ReviewsList } from '@/components/reviews/reviews-list';
import { Button } from '@/components/ui/button';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useToast } from '@/contexts/toast-context';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { reviewService } from '@/services/review.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { createMenuItemDetailModalStyles } from '@/styles/components/menu-item-detail-modal.styles';
import { MenuItem, Review } from '@/types/menu.types';
import { checkBookmarkStatus, toggleBookmark } from '@/utils/bookmark.utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';

interface MenuItemDetailModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
}

export const MenuItemDetailModal: React.FC<MenuItemDetailModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createMenuItemDetailModalStyles(theme), [theme]);
  const { t } = useCMS();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.cart);
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState('0.0');
  const [totalReviews, setTotalReviews] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    if (visible && item) {
      loadReviews();
      loadBookmarkStatus();
    }
  }, [visible, item]);

  const loadReviews = async () => {
    if (!item) return;
    
    try {
      const [itemReviews, stats] = await Promise.all([
        reviewService.getMenuItemReviews(item.id),
        reviewService.getMenuItemStats(item.id),
      ]);
      
      setReviews(itemReviews);
      setAverageRating(stats.averageRating.toFixed(1));
      setTotalReviews(stats.totalReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadBookmarkStatus = async () => {
    if (!item || !user) return;
    
    const bookmarked = await checkBookmarkStatus(user.id.toString(), item.id);
    setIsBookmarked(bookmarked);
  };

  const handleBookmarkToggle = async () => {
    if (!item) return;

    try {
      setIsBookmarking(true);
      const newBookmarkStatus = await toggleBookmark(user?.id.toString(), item);
      setIsBookmarked(newBookmarkStatus);
    } catch (error) {
      // Error already logged in utils
    } finally {
      setIsBookmarking(false);
    }
  };

  if (!item) return null;

  const handleAddToCart = async () => {
    if (!user) {
      console.log('Please login to add items to cart');
      return;
    }
 
    try {
      const result = await dispatch(addToCart({
        userId: user.id.toString(),
        userName: user.name,
        menuItem: item,
        quantity,
      })).unwrap();
      
      
      const cartItems = result.items.map(cartItem => cartItem.menuItem);
      showToast(cartItems, result.totalItems);
      
      onClose();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <RView style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <RView style={styles.modalContainer}>
          <RView style={styles.header}>
            <Text variant="title" style={styles.headerTitle}>
              {item.name}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </RView>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <Image 
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
            />

            <RView style={styles.content}>
              <RView style={styles.indicators}>
                <VegIndicator isVeg={item.veg} />
                <RView style={styles.spicyBadge}>
                  <Ionicons name="flame" size={14} color={colors.primary} />
                  <Text variant="caption" style={styles.spicyText}>
                    {t('menu.spicy')}
                  </Text>
                </RView>
              </RView>

              <RView style={styles.titleRow}>
                <RView style={styles.actions}>
                  <PressableView 
                    style={styles.iconButton} 
                    onPress={handleBookmarkToggle}
                    disabled={isBookmarking}
                  >
                    <Ionicons 
                      name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                      size={24} 
                      color={isBookmarked ? colors.primary : colors.text} 
                    />
                  </PressableView>
                  <PressableView style={styles.iconButton} onPress={() => {}}>
                    <Ionicons name="share-social-outline" size={24} color={colors.text} />
                  </PressableView>
                </RView>
              </RView>

              <Text variant="body" style={styles.description}>
                {item.dishInfo}
              </Text>

              <RView style={styles.ratingContainer}>
                <Ionicons name="star" size={18} color={colors.primary} />
                <Text variant="body" style={styles.rating}>
                  {averageRating}
                </Text>
                <Text variant="body" style={styles.reviews}>
                  {t('menu.reviews', { count: totalReviews.toString() })}
                </Text>
              </RView>

              <RView style={styles.prepTimeContainer}>
                <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                <Text variant="body" style={styles.prepTime}>
                  {t('menu.prepTime', { time: item.prepTime.toString() })}
                </Text>
              </RView>

              {item.discount > 0 && (
                <RView style={styles.discountBadge}>
                  <Text variant="body" style={styles.discountText}>
                    {t('menu.discount', { percent: item.discount.toString() })}
                  </Text>
                </RView>
              )}

              {/* Reviews Section */}
              <ReviewsList
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            </RView>
          </ScrollView>

          <RView style={styles.footer}>
            <RView style={styles.quantityContainer}>
              <Button
                variant="outline"
                size="small"
                onPress={() => handleQuantityChange(-1)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={20} color={colors.primary} />
              </Button>
              <Text variant="body" style={styles.quantity}>
                {quantity}
              </Text>
              <Button
                variant="outline"
                size="small"
                onPress={() => handleQuantityChange(1)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
              </Button>
            </RView>
            <Button
              title={t('menu.addItem', { price: (item.price * quantity).toString() })}
              onPress={handleAddToCart}
              style={styles.addButton}
              disabled={isLoading}
            />
          </RView>
        </RView>
      </RView>
    </Modal>
  );
};
