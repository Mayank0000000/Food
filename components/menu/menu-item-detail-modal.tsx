import { VegIndicator } from '@/components/menu/veg-indicator';
import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { menuItemDetailModalStyles } from '@/styles/components/menu-item-detail-modal.styles';
import { MenuItem } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
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
  if (!item) return null;

  const averageRating = item.rating.length > 0 
    ? (item.rating.reduce((a, b) => a + b, 0) / item.rating.length).toFixed(1)
    : '0.0';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={menuItemDetailModalStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={menuItemDetailModalStyles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity 
            style={menuItemDetailModalStyles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close-circle" size={32} color="#333" />
          </TouchableOpacity>

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
                    Spicy
                  </Text>
                </RView>
              </RView>

              <RView style={menuItemDetailModalStyles.titleRow}>
                <Text variant="title" style={menuItemDetailModalStyles.title}>
                  {item.name}
                </Text>
                <RView style={menuItemDetailModalStyles.actions}>
                  <TouchableOpacity style={menuItemDetailModalStyles.iconButton}>
                    <Ionicons name="bookmark-outline" size={24} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity style={menuItemDetailModalStyles.iconButton}>
                    <Ionicons name="share-social-outline" size={24} color="#333" />
                  </TouchableOpacity>
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
                  ({item.reviews} reviews)
                </Text>
              </RView>

              <RView style={menuItemDetailModalStyles.prepTimeContainer}>
                <Ionicons name="time-outline" size={18} color="#666" />
                <Text variant="body" style={menuItemDetailModalStyles.prepTime}>
                  Prep time: {item.prepTime} mins
                </Text>
              </RView>

              {item.discount > 0 && (
                <RView style={menuItemDetailModalStyles.discountBadge}>
                  <Text variant="body" style={menuItemDetailModalStyles.discountText}>
                    {item.discount}% OFF
                  </Text>
                </RView>
              )}
            </RView>
          </ScrollView>

          <RView style={menuItemDetailModalStyles.footer}>
            <RView style={menuItemDetailModalStyles.quantityContainer}>
              <TouchableOpacity 
                style={menuItemDetailModalStyles.quantityButton}
                onPress={() => {}}
              >
                <Ionicons name="remove" size={20} color="#FF6B35" />
              </TouchableOpacity>
              <Text variant="body" style={menuItemDetailModalStyles.quantity}>
                1
              </Text>
              <TouchableOpacity 
                style={menuItemDetailModalStyles.quantityButton}
                onPress={() => {}}
              >
                <Ionicons name="add" size={20} color="#FF6B35" />
              </TouchableOpacity>
            </RView>
            <Button
              title={`Add item ₹${item.price}`}
              onPress={() => {
                onClose();
              }}
              style={menuItemDetailModalStyles.addButton}
            />
          </RView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
