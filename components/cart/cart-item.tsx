import { VegIndicator } from '@/components/menu/veg-indicator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createCartItemStyles } from '@/styles/components/cart-item.styles';
import { CartItem } from '@/types/cart.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { theme, colors } = useTheme();
  const cartItemStyles = useMemo(() => createCartItemStyles(theme), [theme]);
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <Card style={cartItemStyles.container}>
      <Image
        source={{ uri: item.menuItem.image }}
        style={cartItemStyles.image}
        contentFit="cover"
      />
      
      <RView style={cartItemStyles.content}>
        <RView style={cartItemStyles.header}>
          <VegIndicator isVeg={item.menuItem.veg} />
          <Text variant="subtitle" style={cartItemStyles.name} numberOfLines={2}>
            {item.menuItem.name}
          </Text>
        </RView>

        <Text variant="caption" style={cartItemStyles.description} numberOfLines={2}>
          {item.menuItem.dishInfo}
        </Text>

        <RView style={cartItemStyles.footer}>
          <RView style={cartItemStyles.quantityContainer}>
            <Button
              variant="outline"
              size="small"
              onPress={handleDecrease}
              style={cartItemStyles.quantityButton}
            >
              <Ionicons name="remove" size={16} color={colors.primary} />
            </Button>
            <Text variant="body" style={cartItemStyles.quantity}>
              {item.quantity}
            </Text>
            <Button
              variant="outline"
              size="small"
              onPress={handleIncrease}
              style={cartItemStyles.quantityButton}
            >
              <Ionicons name="add" size={16} color={colors.primary} />
            </Button>
          </RView>

          <Text variant="subtitle" style={cartItemStyles.price}>
            ₹{item.menuItem.price * item.quantity}
          </Text>
        </RView>
      </RView>

      <PressableView
        style={cartItemStyles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </PressableView>
    </Card>
  );
};