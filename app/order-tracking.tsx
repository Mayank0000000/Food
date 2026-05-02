import { DeliveryMap } from '@/components/order/delivery-map';
import { OrderStatusSection } from '@/components/order/order-status-section';
import { OrderTrackingAlerts } from '@/components/order/order-tracking-alerts';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { DEMO_LOCATIONS, RESTAURANT_ADDRESS, RESTAURANT_NAME } from '@/data/locations';
import { getDirections } from '@/services/directions.service';
import { cancelOrder, getOrderById } from '@/services/order.service';
import { useAppSelector } from '@/store/hooks';
import { orderTrackingStyles } from '@/styles/screens/order-tracking.styles';
import { Location } from '@/types/order.types';
import { calculateDistance } from '@/utils/locationUtils';
import { clearTrackingData, formatTime, OrderTrackingData } from '@/utils/orderSimulation';
import { getStatusText } from '@/utils/orderTrackingHelpers';
import { calculateRemainingTime, calculateTrackingData } from '@/utils/orderTrackingLogic';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function OrderTracking() {
  const router = useRouter();
  const { orderId: urlOrderId } = useLocalSearchParams<{ orderId?: string }>();
  const { activeOrders } = useAppSelector((state) => state.order);
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);
  const [remainingTime, setRemainingTime] = useState(120);
  const [routePath, setRoutePath] = useState<Location[]>([]);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { restaurant } = DEMO_LOCATIONS;
  const delivery = deliveryLocation || DEMO_LOCATIONS.delivery;
  
  const distance = calculateDistance(
    restaurant.latitude,
    restaurant.longitude,
    delivery.latitude,
    delivery.longitude
  );

  useEffect(() => {
    // Load order data from URL param or AsyncStorage or Redux
    const loadOrderData = async () => {
      try {
        let targetOrderId: string | null = null;
        let targetLocation: Location | null = null;

        // Priority 1: URL parameter (from home page "Track" button)
        if (urlOrderId) {
          targetOrderId = urlOrderId;
          const order = activeOrders?.find(o => o.id === urlOrderId);
          if (order) {
            targetLocation = order.deliveryLocation;
          }
        }
        // Priority 2: AsyncStorage (fresh order from cart)
        else {
          const storedLocation = await AsyncStorage.getItem('deliveryLocation');
          const storedOrderId = await AsyncStorage.getItem('currentOrderId');
          
          if (storedLocation && storedOrderId) {
            targetOrderId = storedOrderId;
            targetLocation = JSON.parse(storedLocation);
          }
          // Priority 3: First active order from Redux
          else if (activeOrders && activeOrders.length > 0) {
            const firstOrder = activeOrders[0];
            targetOrderId = firstOrder.id;
            targetLocation = firstOrder.deliveryLocation;
          }
        }

        if (targetOrderId && targetLocation) {
          setOrderId(targetOrderId);
          setDeliveryLocation(targetLocation);
        } else {
          // No active orders, go back to home
          router.replace('/(tabs)/home');
        }
      } catch (error) {
        console.error('Failed to load order data:', error);
      }
    };

    loadOrderData();
  }, [urlOrderId, activeOrders]);

  useEffect(() => {
    if (!deliveryLocation || !orderId) return;

    let interval: ReturnType<typeof setInterval>;

    const initTracking = async () => {
      try {
        const order = await getOrderById(orderId);
        
        if (!order) {
          console.error('Order not found');
          return;
        }

        // Fetch route path
        const directions = await getDirections(restaurant, delivery);
        const path = directions?.path || [restaurant, delivery];
        setRoutePath(path);

        // Update position based on order creation time
        const updatePosition = () => {
          const createdTime = new Date(order.createdAt).getTime();
          const elapsedSeconds = (Date.now() - createdTime) / 1000;

          // Calculate tracking data using util function
          const data = calculateTrackingData(
            order.id,
            order.createdAt,
            path,
            restaurant,
            delivery
          );

          if (!data) return;

          setTrackingData(data);
          setRemainingTime(calculateRemainingTime(elapsedSeconds));

          // Auto-navigate home when delivered
          if (data.status === 'delivered') {
            if (interval) clearInterval(interval);
            // Give user time to see the delivered status before navigating
            setTimeout(async () => {
              await handleOrderComplete();
            }, 2000);
          }
        };

        updatePosition();
        interval = setInterval(updatePosition, 500);
      } catch (error) {
        console.error('Failed to initialize tracking:', error);
      }
    };

    initTracking();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [deliveryLocation, orderId, restaurant, delivery]);

  const handleOrderComplete = async () => {
    if (!orderId) return;

    try {
      
      // Send order delivered notification
      const { notificationService } = await import('@/services/notification.service');
      await notificationService.notifyOrderDelivered(orderId);
      
    } catch (error) {
      console.error('❌ Failed to send delivered notification:', error);
    }

    // Wait a bit to ensure notification is processed
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clean up local storage and navigate
    await AsyncStorage.removeItem('deliveryLocation');
    await AsyncStorage.removeItem('currentOrderId');
    await clearTrackingData();
    router.replace('/(tabs)/home');
  };

  const handleBackToHome = () => {
    setShowLeaveAlert(true);
  };

  const handleLeaveConfirm = async () => {
    // Clear stored location and order ID
    await AsyncStorage.removeItem('deliveryLocation');
    await AsyncStorage.removeItem('currentOrderId');
    await clearTrackingData();
    router.replace('/(tabs)/home');
  };

  const handleCancelOrder = () => {
    // Can only cancel if not out for delivery or delivered
    if (trackingData && (trackingData.status === 'out_for_delivery' || trackingData.status === 'delivered')) {
      return;
    }
    setShowCancelAlert(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderId) return;

    try {
      await cancelOrder(orderId);
      console.log('✅ Order cancelled');

      // Send order cancelled notification
      const { notificationService } = await import('@/services/notification.service');
      await notificationService.notifyOrderCancelled(orderId, 'Order cancelled by user');

      // Clear stored data and go home
      await AsyncStorage.removeItem('deliveryLocation');
      await AsyncStorage.removeItem('currentOrderId');
      await clearTrackingData();
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  return (
    <SafeAreaView style={orderTrackingStyles.container} edges={['top']}>
      <RView style={orderTrackingStyles.header}>
        <RView style={orderTrackingStyles.headerContent}>
          <Ionicons 
            name={trackingData?.status === 'delivered' ? 'checkmark-circle' : 'time'} 
            size={32} 
            color={trackingData?.status === 'delivered' ? '#22C55E' : '#FF6B35'} 
          />
          <RView style={orderTrackingStyles.headerText}>
            <Text style={orderTrackingStyles.headerTitle}>
              {trackingData ? getStatusText(trackingData.status) : 'Loading...'}
            </Text>
            <Text style={orderTrackingStyles.headerSubtitle}>
              {trackingData?.status === 'delivered' 
                ? 'Order completed!' 
                : `Arriving in ${formatTime(remainingTime)}`}
            </Text>
          </RView>
        </RView>
      </RView>

      <DeliveryMap
        restaurant={restaurant}
        delivery={delivery}
        trackingData={trackingData}
        routePath={routePath}
        restaurantName={RESTAURANT_NAME}
        restaurantAddress={RESTAURANT_ADDRESS}
      />

      <OrderStatusSection
        trackingData={trackingData}
        distance={distance}
        onCancelOrder={handleCancelOrder}
        onBackToHome={handleBackToHome}
      />

      <OrderTrackingAlerts
        showDeliveredAlert={false}
        showLeaveAlert={showLeaveAlert}
        showCancelAlert={showCancelAlert}
        onDeliveredConfirm={handleOrderComplete}
        onLeaveConfirm={handleLeaveConfirm}
        onCancelConfirm={handleCancelConfirm}
        onDismissDelivered={() => {}}
        onDismissLeave={() => setShowLeaveAlert(false)}
        onDismissCancel={() => setShowCancelAlert(false)}
      />
    </SafeAreaView>
  );
}
