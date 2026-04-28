import { DeliveryMap } from '@/components/order/delivery-map';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { DEMO_LOCATIONS, RESTAURANT_ADDRESS, RESTAURANT_NAME } from '@/data/locations';
import { getDirections } from '@/services/directions.service';
import { orderTrackingStyles } from '@/styles/screens/order-tracking.styles';
import { Location } from '@/types/order.types';
import { calculateDistance } from '@/utils/locationUtils';
import {
  clearTrackingData,
  formatTime,
  getRemainingTime,
  getTrackingData,
  OrderTrackingData,
  startDeliverySimulation,
  updateDeliveryPosition,
} from '@/utils/orderSimulation';
import {
  getStatusText,
  getStatusTimeText,
  isStatusActive,
} from '@/utils/orderTrackingHelpers';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderTracking() {
  const router = useRouter();
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);
  const [remainingTime, setRemainingTime] = useState(120);
  const [routePath, setRoutePath] = useState<Location[]>([]);
  const [showDeliveredAlert, setShowDeliveredAlert] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);

  const { restaurant } = DEMO_LOCATIONS;
  const delivery = deliveryLocation || DEMO_LOCATIONS.delivery;
  
  const distance = calculateDistance(
    restaurant.latitude,
    restaurant.longitude,
    delivery.latitude,
    delivery.longitude
  );

  useEffect(() => {
    // Load user's delivery location from AsyncStorage
    const loadDeliveryLocation = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem('deliveryLocation');
        if (storedLocation) {
          setDeliveryLocation(JSON.parse(storedLocation));
        }
      } catch (error) {
        console.error('Failed to load delivery location:', error);
      }
    };

    loadDeliveryLocation();
  }, []);

  useEffect(() => {
    if (!deliveryLocation) return; // Wait for location to load

    // Start simulation when component mounts
    const initSimulation = async () => {
      const orderId = `ORDER_${Date.now()}`;
      
      // Fetch directions from OpenRouteService
      const directions = await getDirections(restaurant, delivery);
      const path = directions?.path || [restaurant, delivery];
      
      console.log('🛣️ Route path has', path.length, 'points');
      setRoutePath(path); // Store path for visualization
      
      await startDeliverySimulation(orderId, restaurant, delivery, path);
      const data = await getTrackingData();
      if (data) {
        setTrackingData(data);
        setRemainingTime(getRemainingTime(data));
      }
    };

    initSimulation();

    // Update position every 500ms for smooth animation
    const interval = setInterval(async () => {
      const updated = await updateDeliveryPosition(restaurant, delivery);
      if (updated) {
        setTrackingData(updated);
        setRemainingTime(getRemainingTime(updated));

        // Check if delivered
        if (updated.status === 'delivered') {
          clearInterval(interval);
          setTimeout(() => {
            setShowDeliveredAlert(true);
          }, 500);
        }
      }
    }, 500); // Update every 500ms for smooth movement

    return () => {
      clearInterval(interval);
    };
  }, [deliveryLocation]); // Re-run when delivery location is loaded

  const handleOrderComplete = async () => {
    // Clear stored location
    await AsyncStorage.removeItem('deliveryLocation');
    await clearTrackingData();
    router.replace('/(tabs)/home');
  };

  const handleBackToHome = () => {
    setShowLeaveAlert(true);
  };

  const handleLeaveConfirm = async () => {
    // Clear stored location
    await AsyncStorage.removeItem('deliveryLocation');
    await clearTrackingData();
    router.replace('/(tabs)/home');
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

      <ScrollView style={orderTrackingStyles.infoContainer}>
        <RView style={orderTrackingStyles.statusCard}>
          <Text style={orderTrackingStyles.statusTitle}>Order Status</Text>
          
          <RView style={orderTrackingStyles.statusItem}>
            <RView style={trackingData && isStatusActive(trackingData.status, 'confirmed') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
              <Ionicons name="checkmark" size={16} color={trackingData && isStatusActive(trackingData.status, 'confirmed') ? '#fff' : '#999'} />
            </RView>
            <RView style={orderTrackingStyles.statusContent}>
              <Text style={orderTrackingStyles.statusLabel}>Order Confirmed</Text>
              <Text style={orderTrackingStyles.statusTime}>
                {trackingData ? getStatusTimeText(trackingData.status, 'confirmed') : 'Pending'}
              </Text>
            </RView>
          </RView>

          <RView style={orderTrackingStyles.statusLine} />

          <RView style={orderTrackingStyles.statusItem}>
            <RView style={trackingData && isStatusActive(trackingData.status, 'preparing') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
              <Ionicons name="restaurant" size={16} color={trackingData && isStatusActive(trackingData.status, 'preparing') ? '#fff' : '#999'} />
            </RView>
            <RView style={orderTrackingStyles.statusContent}>
              <Text style={[orderTrackingStyles.statusLabel, trackingData && !isStatusActive(trackingData.status, 'preparing') && { color: '#999' }]}>
                Preparing Your Order
              </Text>
              <Text style={orderTrackingStyles.statusTime}>
                {trackingData ? getStatusTimeText(trackingData.status, 'preparing') : 'Pending'}
              </Text>
            </RView>
          </RView>

          <RView style={orderTrackingStyles.statusLine} />

          <RView style={orderTrackingStyles.statusItem}>
            <RView style={trackingData && isStatusActive(trackingData.status, 'out_for_delivery') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
              <Ionicons name="bicycle" size={16} color={trackingData && isStatusActive(trackingData.status, 'out_for_delivery') ? '#fff' : '#999'} />
            </RView>
            <RView style={orderTrackingStyles.statusContent}>
              <Text style={[orderTrackingStyles.statusLabel, trackingData && !isStatusActive(trackingData.status, 'out_for_delivery') && { color: '#999' }]}>
                Out for Delivery
              </Text>
              <Text style={orderTrackingStyles.statusTime}>
                {trackingData ? getStatusTimeText(trackingData.status, 'out_for_delivery') : 'Pending'}
              </Text>
            </RView>
          </RView>

          <RView style={orderTrackingStyles.statusLine} />

          <RView style={orderTrackingStyles.statusItem}>
            <RView style={trackingData && isStatusActive(trackingData.status, 'delivered') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
              <Ionicons name="home" size={16} color={trackingData && isStatusActive(trackingData.status, 'delivered') ? '#fff' : '#999'} />
            </RView>
            <RView style={orderTrackingStyles.statusContent}>
              <Text style={[orderTrackingStyles.statusLabel, trackingData && !isStatusActive(trackingData.status, 'delivered') && { color: '#999' }]}>
                Delivered
              </Text>
              <Text style={orderTrackingStyles.statusTime}>
                {trackingData ? getStatusTimeText(trackingData.status, 'delivered') : 'Pending'}
              </Text>
            </RView>
          </RView>
        </RView>

        <RView style={orderTrackingStyles.infoCard}>
          <RView style={orderTrackingStyles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={orderTrackingStyles.infoText}>
              Distance: {distance} km
            </Text>
          </RView>
          <RView style={orderTrackingStyles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#666" />
            <Text style={orderTrackingStyles.infoText}>
              Payment: Cash on Delivery
            </Text>
          </RView>
        </RView>

        <Button
          title="Back to Home"
          onPress={handleBackToHome}
          variant="outline"
          style={orderTrackingStyles.backButton}
        />
      </ScrollView>

      <Alert
        visible={showDeliveredAlert}
        title="Order Delivered! 🎉"
        message="Your order has been delivered successfully. Enjoy your meal!"
        buttons={[
          {
            text: 'OK',
            onPress: handleOrderComplete,
          },
        ]}
        onDismiss={() => setShowDeliveredAlert(false)}
      />

      <Alert
        visible={showLeaveAlert}
        title="Leave Tracking?"
        message="Your order is still being delivered. Are you sure you want to leave?"
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: handleLeaveConfirm,
          },
        ]}
        onDismiss={() => setShowLeaveAlert(false)}
      />
    </SafeAreaView>
  );
}
