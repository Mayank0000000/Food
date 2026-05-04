import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { myOrdersStyles } from '@/styles/screens/my-orders.styles';
import { Order } from '@/types/order.types';
import { formatOrderDate, getOrderStatusColor, getOrderStatusText } from '@/utils/orderUtils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';

interface OrderItemProps {
  order: Order;
  onReorder: (order: Order) => void;
  onMenuPress?: (order: Order) => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order, onReorder, onMenuPress }) => {
  const { t } = useCMS();
  const statusColor = getOrderStatusColor(order.status);
  const firstItem = order.items[0];

  return (
    <Card style={myOrdersStyles.orderCard}>
      {/* Restaurant/Order Header */}
      <RView style={myOrdersStyles.orderHeader}>
        {firstItem.image && (
          <Image
            source={{ uri: firstItem.image }}
            style={myOrdersStyles.restaurantImage}
            contentFit="cover"
          />
        )}
        <RView style={myOrdersStyles.headerInfo}>
          <Text variant="subtitle" style={myOrdersStyles.restaurantName}>
            {firstItem.category || 'Restaurant'}
          </Text>
          <Text variant="caption" style={myOrdersStyles.restaurantLocation}>
            BTM, Bangalore
          </Text>
          <Text variant="caption" style={myOrdersStyles.viewMenu}>
            View menu ▸
          </Text>
        </RView>
        <Button
          variant="outline"
          size="small"
          onPress={() => onMenuPress?.(order)}
          style={myOrdersStyles.menuButton}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </Button>
      </RView>

      {/* Order Items */}
      <RView style={myOrdersStyles.itemsSection}>
        {order.items.map((item, index) => (
          <RView key={index} style={myOrdersStyles.itemRow}>
            <Ionicons name="square" size={12} color="#FF6B35" style={{ marginRight: 8 }} />
            <Text variant="body" style={myOrdersStyles.itemQuantity}>
              {item.quantity} x
            </Text>
            <Text variant="body" style={myOrdersStyles.itemName}>
              {item.name}
            </Text>
          </RView>
        ))}
      </RView>

      {/* Order Details */}
      <RView style={myOrdersStyles.orderDetails}>
        <Text variant="caption" style={myOrdersStyles.detailLabel}>
          Order placed on {formatOrderDate(order.createdAt)}
        </Text>
        <Text variant="body" style={[myOrdersStyles.statusText, { color: statusColor }]}>
          {getOrderStatusText(order.status)}
        </Text>
      </RView>

      {/* Footer */}
      <RView style={myOrdersStyles.orderFooter}>
        <Text variant="subtitle" style={myOrdersStyles.totalAmount}>
          ₹{order.finalAmount}
        </Text>
        {order.status === 'delivered' && (
          <RView style={myOrdersStyles.actionButtons}>
            <RView style={myOrdersStyles.ratingSection}>
              <Text variant="caption" style={myOrdersStyles.rateLabel}>
                Rate
              </Text>
              <RView style={myOrdersStyles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star-outline"
                    size={16}
                    color="#D1D5DB"
                    style={{ marginLeft: 2 }}
                  />
                ))}
              </RView>
            </RView>
            <Button
              title={t('orders.reorder')}
              onPress={() => onReorder(order)}
              style={myOrdersStyles.reorderButton}
              size="small"
            />
          </RView>
        )}
      </RView>
    </Card>
  );
};
