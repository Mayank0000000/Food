import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { orderTrackingStyles } from '@/styles/screens/order-tracking.styles';
import { OrderStatusSectionProps } from '@/types/components/order-status-section.types';
import { getStatusTimeText, isStatusActive } from '@/utils/orderTrackingHelpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native';

export const OrderStatusSection: React.FC<OrderStatusSectionProps> = ({
  trackingData,
  distance,
  onCancelOrder,
  onBackToHome,
}) => {
  return (
    <ScrollView style={orderTrackingStyles.infoContainer}>
      <RView style={orderTrackingStyles.statusCard}>
        <Text style={orderTrackingStyles.statusTitle}>Order Status</Text>
        
        {/* Order Confirmed */}
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

        {/* Preparing Your Order */}
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

        {/* Out for Delivery */}
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

        {/* Delivered */}
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

      {/* Order Info */}
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

      {/* Cancel button - only show if order is not out for delivery or delivered */}
      {trackingData && trackingData.status !== 'out_for_delivery' && trackingData.status !== 'delivered' && (
        <Button
          title="Cancel Order"
          onPress={onCancelOrder}
          variant="outline"
          style={[orderTrackingStyles.backButton, { borderColor: '#EF4444' }]}
          textStyle={{ color: '#EF4444' }}
        />
      )}

      <Button
        title="Back to Home"
        onPress={onBackToHome}
        variant="outline"
        style={orderTrackingStyles.backButton}
      />
    </ScrollView>
  );
};
