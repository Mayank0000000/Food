import { ReviewSubmissionModal } from '@/components/reviews/review-submission-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { reviewService } from '@/services/review.service';
import { useAppSelector } from '@/store/hooks';
import { myOrdersStyles } from '@/styles/screens/my-orders.styles';
import { Order } from '@/types/order.types';
import { formatOrderDate, getOrderStatusColor, getOrderStatusText } from '@/utils/orderUtils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface OrderItemProps {
  order: Order;
  onReorder: (order: Order) => void;
  onMenuPress?: (order: Order) => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order, onReorder, onMenuPress }) => {
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useCMS();
  const statusColor = getOrderStatusColor(order.status);
  const firstItem = order.items[0];

  // Check if user already reviewed this order's first item
  useEffect(() => {
    if (order.status !== 'delivered' || !user) return;

    reviewService
      .hasUserReviewed(firstItem.id, user.id.toString(), firstItem.name)
      .then(({ reviewed, rating }) => {
        setHasReviewed(reviewed);
        setUserRating(rating);
      })
      .catch(() => setHasReviewed(false));
  }, [order.id, order.status, user?.id]);

  const handleRateItem = (item: Order['items'][0]) => {
    if (hasReviewed) return;
    setSelectedItemForReview({ id: item.id, name: item.name });
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async (rating: number, feedback: string) => {
    if (!user || !selectedItemForReview) return;

    await reviewService.submitReview(
      selectedItemForReview.id,
      user.id.toString(),
      user.name,
      rating,
      feedback,
      selectedItemForReview.name
    );
    Alert.alert(t('reviews.success'), t('reviews.thankYou'));
    setHasReviewed(true);
    setUserRating(rating); // store the actual rating given
  };

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
            {hasReviewed ? (
              // Already reviewed — show actual rating stars, non-tappable
              <RView style={myOrdersStyles.ratingSection}>
                <Text variant="caption" style={[myOrdersStyles.rateLabel, { color: '#FF6B35' }]}>
                  Rated
                </Text>
                <RView style={myOrdersStyles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= userRating ? 'star' : 'star-outline'}
                      size={16}
                      color={star <= userRating ? '#FF6B35' : '#D1D5DB'}
                      style={{ marginLeft: 2 }}
                    />
                  ))}
                </RView>
              </RView>
            ) : (
              // Not yet reviewed — tappable
              <PressableView
                style={myOrdersStyles.ratingSection}
                onPress={() => handleRateItem(firstItem)}
              >
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
              </PressableView>
            )}
            <Button
              title={t('orders.reorder')}
              onPress={() => onReorder(order)}
              style={myOrdersStyles.reorderButton}
              size="small"
            />
          </RView>
        )}
      </RView>

      {/* Review Modal */}
      {selectedItemForReview && (
        <ReviewSubmissionModal
          visible={reviewModalVisible}
          itemName={selectedItemForReview.name}
          onClose={() => {
            setReviewModalVisible(false);
            setSelectedItemForReview(null);
          }}
          onSubmit={handleSubmitReview}
        />
      )}
    </Card>
  );
};
