import { NotificationToast } from '@/components/ui/notification-toast';
import { updateOrderStatus } from '@/services/order.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchActiveOrders, removeActiveOrder } from '@/store/slices/orderSlice';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface OrderProgress {
  orderId: string;
  progress: number; // 0-100
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
  const deliveredOrdersRef = useRef<Set<string>>(new Set());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        
        // Calculate progress (0-100%)
        const progress = Math.min((elapsedSeconds / totalSeconds) * 100, 100);
        progressList.push({ orderId: order.id, progress });

        // Check if order is complete (100%) and not already processed
        if (progress >= 100 && !deliveredOrdersRef.current.has(order.id)) {
          deliveredOrdersRef.current.add(order.id);

          // Update order status in API
          try {
            await updateOrderStatus(order.id, 'delivered');
          } catch (error) {
            console.error('Failed to update order status:', error);
          }

          // Show toast for this order
          setDeliveredOrderId(order.id);

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

    // Initial update
    updateAllProgress();

    // Update every second
    progressIntervalRef.current = setInterval(updateAllProgress, 1000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [activeOrders, dispatch, user?.id]);

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
