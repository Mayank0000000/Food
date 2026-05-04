import { VegIndicator } from '@/components/menu/veg-indicator';
import { Button } from '@/components/ui/button';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useToast } from '@/contexts/toast-context';
import { useCMS } from '@/hooks/useCMS';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { menuItemDetailModalStyles } from '@/styles/components/menu-item-detail-modal.styles';
import { MenuItem } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView } from 'react-native';

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
  const { isLoading, cart } = useAppSelector((state) => state.cart);
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const averageRating = item.rating.length > 0 
    ? (item.rating.reduce((a, b) => a + b, 0) / item.rating.length).toFixed(1)
    : '0.0';

  const handleAddToCart = async () => {
 
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
      <PressableView 
        style={menuItemDetailModalStyles.overlay}
        onPress={onClose}
      >
        <PressableView 
          style={menuItemDetailModalStyles.modalContainer}
          onPress={(e) => e?.stopPropagation?.()}
        >
          <PressableView 
            style={menuItemDetailModalStyles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close-circle" size={32} color="#333" />
          </PressableView>

          <ScrollView 
            style={menuItemDetailModalStyles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
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
                <Text variant="title" style={menuItemDetailModalStyles.title}>
                  {item.name}
                </Text>
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
                  {t('menu.reviews', { count: item.reviews.toString() })}
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
        </PressableView>
      </PressableView>
    </Modal>
  );
};
