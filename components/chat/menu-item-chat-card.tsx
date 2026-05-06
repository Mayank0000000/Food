import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { menuItemChatCardStyles } from '@/styles/components/menu-item-chat-card.styles';
import { MenuItem } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

interface MenuItemChatCardProps {
  item: MenuItem;
  onPress: () => void;
}

export function MenuItemChatCard({ item, onPress }: MenuItemChatCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <RView style={menuItemChatCardStyles.card}>
        {/* Image */}
        <Image
          source={{ uri: item.image }}
          style={menuItemChatCardStyles.image}
          resizeMode="cover"
        />
        
        {/* Content */}
        <RView style={menuItemChatCardStyles.content}>
          {/* Name and Veg indicator */}
          <RView style={menuItemChatCardStyles.header}>
            <Text style={menuItemChatCardStyles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <RView style={[
              menuItemChatCardStyles.vegBadge,
              item.veg ? menuItemChatCardStyles.vegBadgeGreen : menuItemChatCardStyles.vegBadgeRed
            ]}>
              <RView style={[
                menuItemChatCardStyles.vegDot,
                item.veg ? menuItemChatCardStyles.vegDotGreen : menuItemChatCardStyles.vegDotRed
              ]} />
            </RView>
          </RView>
          
          {/* Rating and Price */}
          <RView style={menuItemChatCardStyles.info}>
            <RView style={menuItemChatCardStyles.rating}>
              <Ionicons name="star" size={14} color="#FFA500" />
              <Text style={menuItemChatCardStyles.ratingText}>{item.rating}</Text>
            </RView>
            <Text style={menuItemChatCardStyles.price}>₹{item.price}</Text>
          </RView>
          
          {/* Category */}
          <Text style={menuItemChatCardStyles.category} numberOfLines={1}>
            {item.category}
          </Text>
        </RView>
      </RView>
    </TouchableOpacity>
  );
}
