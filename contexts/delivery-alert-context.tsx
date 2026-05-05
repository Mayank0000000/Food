import { ReviewSubmissionModal } from '@/components/reviews/review-submission-modal';
import { NotificationToast } from '@/components/ui/notification-toast';
import { updateOrderStatus } from '@/services/order.service';
import { reviewService } from '@/services/review.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchActiveOrders, removeActiveOrder } from '@/store/slices/orderSlice';
import { Order } from '@/types/order.types';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface OrderProgress {
  orderId: string;
  progress: number; // 0-100
}

interface PendingReview {
  menuItemId: number;
  menuItemName: string;
  orderId: string;
}

interface DeliveryAlertContextType {
  ordersProgress: OrderProgress[];
}

const DeliveryAlertContext = createContext<DeliveryAlertContextType>({ ordersProgress: [] });

export const DeliveryAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeOrders } = useAppSelector((state) => state.order);
  const [ordersProgress, setOrdersProgress] = useState<OrderProgress[]>([]);
  const [deliveredOrderId, setDeliveredOrderId] = useState<string | null>(null);
  const [reviewQueue, setReviewQueue] = useState<PendingReview[]>([]);
  const [currentReview, setCurrentReview] = useState<PendingReview | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const deliveredOrdersRef = useRef<Set<string>>(new Set());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // When queue has items and no modal is showing, show the next one
  useEffect(() => {
    if (reviewQueue.length > 0 && !reviewModalVisible) {
      const [next, ...rest] = reviewQueue;
      setCurrentReview(next);
      setReviewQueue(rest);
      setReviewModalVisible(true);
    }
  }, [reviewQueue, reviewModalVisible]);

  const queueReviewsForOrder = (order: Order) => {
    // Only queue items that have a valid menu item ID (not timestamp IDs)
    const items: PendingReview[] = order.items.map(item => ({
      menuItemId: item.id,
      menuItemName: item.name || 'your order',
      orderId: order.id,
    }));

    setTimeout(() => {
      setReviewQueue(prev => [...prev, ...items]);
    }, 5000); // 5 seconds after delivery
  };

  // Calculate progress for all active orders
  useEffect(() => {
    if (!activeOrders || activeOrders.length === 0) {
      setOrdersProgress([]);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    const updateAllProgress = async () => {
      const progressList: OrderProgress[] = [];

      for (const order of activeOrders) {
        const createdTime = new Date(order.createdAt).getTime();
        const elapsedSeconds = (Date.now() - createdTime) / 1000;
        const totalSeconds = 120; // 2 minutes

        const progress = Math.min((elapsedSeconds / totalSeconds) * 100, 100);
        progressList.push({ orderId: order.id, progress });

        if (progress >= 100 && !deliveredOrdersRef.current.has(order.id)) {
          deliveredOrdersRef.current.add(order.id);

          // Update order status - fire and forget
          updateOrderStatus(order.id, 'delivered').catch(error => {
            console.error('Failed to update order status:', error);
            deliveredOrdersRef.current.delete(order.id);
          });

          // Show delivery toast
          setDeliveredOrderId(order.id);

          // Queue review modal 5 seconds later
          queueReviewsForOrder(order);

          // Remove from active orders after a delay
          setTimeout(() => {
            dispatch(removeActiveOrder(order.id));
            if (user?.id) {
              dispatch(fetchActiveOrders(user.id.toString()));
            }
          }, 1000);
        }
      }

      setOrdersProgress(progressList);
    };

    updateAllProgress();
    progressIntervalRef.current = setInterval(updateAllProgress, 1000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [activeOrders, dispatch, user?.id]);

  const handleReviewSubmit = async (rating: number, feedback: string) => {
    if (!currentReview || !user) return;

    await reviewService.submitReview(
      currentReview.menuItemId,
      user.id.toString(),
      user.name,
      rating,
      feedback,
      currentReview.menuItemName
    );
  };

  const handleReviewClose = () => {
    setReviewModalVisible(false);
    setCurrentReview(null);
  };

  const handleToastClose = () => {
    setDeliveredOrderId(null);
  };

  return (
    <DeliveryAlertContext.Provider value={{ ordersProgress }}>
      {children}

      {/* Global Delivery Toast */}
      <NotificationToast
        visible={!!deliveredOrderId}
        message="🎉 Order delivered! Enjoy your meal!"
        type="success"
        onClose={handleToastClose}
      />

      {/* Global Review Modal - shown 5s after delivery */}
      {currentReview && (
        <ReviewSubmissionModal
          visible={reviewModalVisible}
          itemName={currentReview.menuItemName}
          onClose={handleReviewClose}
          onSubmit={handleReviewSubmit}
        />
      )}
    </DeliveryAlertContext.Provider>
  );
};

export const useDeliveryAlert = () => {
  const context = useContext(DeliveryAlertContext);
  if (!context) {
    throw new Error('useDeliveryAlert must be used within DeliveryAlertProvider');
  }
  return context;
};
