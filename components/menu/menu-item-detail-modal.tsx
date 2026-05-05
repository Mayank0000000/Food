import { VegIndicator } from '@/components/menu/veg-indicator';
import { ReviewsList } from '@/components/reviews/reviews-list';
import { Button } from '@/components/ui/button';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useToast } from '@/contexts/toast-context';
import { useCMS } from '@/hooks/useCMS';
import { reviewService } from '@/services/review.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { menuItemDetailModalStyles } from '@/styles/components/menu-item-detail-modal.styles';
import { MenuItem, Review } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';

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
  const { t } = useCMS();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.cart);
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState('0.0');
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (visible && item) {
      loadReviews();
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

  if (!item) return null;

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to add items to cart');
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
      Alert.alert('Error', 'Failed to add item to cart: ' + error);
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
      <RView style={menuItemDetailModalStyles.overlay}>
        <TouchableOpacity 
          style={menuItemDetailModalStyles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <RView style={menuItemDetailModalStyles.modalContainer}>
          <RView style={menuItemDetailModalStyles.header}>
            <Text variant="title" style={menuItemDetailModalStyles.headerTitle}>
              {item.name}
            </Text>
            <TouchableOpacity 
              style={menuItemDetailModalStyles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </RView>

          <ScrollView 
            style={menuItemDetailModalStyles.scrollView}
            contentContainerStyle={menuItemDetailModalStyles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <Image 
              source={{ uri: item.image }}
              style={menuItemDetailModalStyles.image}
              contentFit="cover"
            />

            <RView style={menuItemDetailModalStyles.content}>
              <RView style={menuItemDetailModalStyles.indicators}>
                <VegIndicator isVeg={item.veg} />
                <RView style={menuItemDetailModalStyles.spicyBadge}>
                  <Ionicons name="flame" size={14} color="#FF6B35" />
                  <Text variant="caption" style={menuItemDetailModalStyles.spicyText}>
                    {t('menu.spicy')}
                  </Text>
                </RView>
              </RView>

              <RView style={menuItemDetailModalStyles.titleRow}>
                <RView style={menuItemDetailModalStyles.actions}>
                  <PressableView style={menuItemDetailModalStyles.iconButton} onPress={() => {}}>
                    <Ionicons name="bookmark-outline" size={24} color="#333" />
                  </PressableView>
                  <PressableView style={menuItemDetailModalStyles.iconButton} onPress={() => {}}>
                    <Ionicons name="share-social-outline" size={24} color="#333" />
                  </PressableView>
                </RView>
              </RView>

              <Text variant="body" style={menuItemDetailModalStyles.description}>
                {item.dishInfo}
              </Text>

              <RView style={menuItemDetailModalStyles.ratingContainer}>
                <Ionicons name="star" size={18} color="#FF6B35" />
                <Text variant="body" style={menuItemDetailModalStyles.rating}>
                  {averageRating}
                </Text>
                <Text variant="body" style={menuItemDetailModalStyles.reviews}>
                  {t('menu.reviews', { count: totalReviews.toString() })}
                </Text>
              </RView>

              <RView style={menuItemDetailModalStyles.prepTimeContainer}>
                <Ionicons name="time-outline" size={18} color="#666" />
                <Text variant="body" style={menuItemDetailModalStyles.prepTime}>
                  {t('menu.prepTime', { time: item.prepTime.toString() })}
                </Text>
              </RView>

              {item.discount > 0 && (
                <RView style={menuItemDetailModalStyles.discountBadge}>
                  <Text variant="body" style={menuItemDetailModalStyles.discountText}>
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

          <RView style={menuItemDetailModalStyles.footer}>
            <RView style={menuItemDetailModalStyles.quantityContainer}>
              <Button
                variant="outline"
                size="small"
                onPress={() => handleQuantityChange(-1)}
                style={menuItemDetailModalStyles.quantityButton}
              >
                <Ionicons name="remove" size={20} color="#FF6B35" />
              </Button>
              <Text variant="body" style={menuItemDetailModalStyles.quantity}>
                {quantity}
              </Text>
              <Button
                variant="outline"
                size="small"
                onPress={() => handleQuantityChange(1)}
                style={menuItemDetailModalStyles.quantityButton}
              >
                <Ionicons name="add" size={20} color="#FF6B35" />
              </Button>
            </RView>
            <Button
              title={t('menu.addItem', { price: (item.price * quantity).toString() })}
              onPress={handleAddToCart}
              style={menuItemDetailModalStyles.addButton}
              disabled={isLoading}
            />
          </RView>
        </RView>
      </RView>
    </Modal>
  );
};
