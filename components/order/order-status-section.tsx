import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createOrderTrackingStyles } from '@/styles/screens/order-tracking.styles';
import { OrderStatusSectionProps } from '@/types/components/order-status-section.types';
import { getStatusTimeText, isStatusActive } from '@/utils/orderTrackingHelpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';

export const OrderStatusSection: React.FC<OrderStatusSectionProps> = ({
  trackingData,
  distance,
  onCancelOrder,
  onBackToHome,
}) => {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const orderTrackingStyles = useMemo(() => createOrderTrackingStyles(theme), [theme]);

  return (
    <ScrollView style={orderTrackingStyles.infoContainer}>
      <RView style={orderTrackingStyles.statusCard}>
        <Text style={orderTrackingStyles.statusTitle}>{t('orderTracking.orderStatus')}</Text>
        
        {/* Order Confirmed */}
        <RView style={orderTrackingStyles.statusItem}>
          <RView style={trackingData && isStatusActive(trackingData.status, 'confirmed') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
            <Ionicons name="checkmark" size={16} color={trackingData && isStatusActive(trackingData.status, 'confirmed') ? '#fff' : colors.textTertiary} />
          </RView>
          <RView style={orderTrackingStyles.statusContent}>
            <Text style={orderTrackingStyles.statusLabel}>{t('orders.status.confirmed')}</Text>
            <Text style={orderTrackingStyles.statusTime}>
              {trackingData ? getStatusTimeText(trackingData.status, 'confirmed') : t('orderTracking.pending')}
            </Text>
          </RView>
        </RView>

        <RView style={orderTrackingStyles.statusLine} />

        {/* Preparing Your Order */}
        <RView style={orderTrackingStyles.statusItem}>
          <RView style={trackingData && isStatusActive(trackingData.status, 'preparing') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
            <Ionicons name="restaurant" size={16} color={trackingData && isStatusActive(trackingData.status, 'preparing') ? '#fff' : colors.textTertiary} />
          </RView>
          <RView style={orderTrackingStyles.statusContent}>
            <Text style={[orderTrackingStyles.statusLabel, trackingData && !isStatusActive(trackingData.status, 'preparing') && { color: colors.textTertiary }]}>
              {t('orders.status.preparing')}
            </Text>
            <Text style={orderTrackingStyles.statusTime}>
              {trackingData ? getStatusTimeText(trackingData.status, 'preparing') : t('orderTracking.pending')}
            </Text>
          </RView>
        </RView>

        <RView style={orderTrackingStyles.statusLine} />

        {/* Out for Delivery */}
        <RView style={orderTrackingStyles.statusItem}>
          <RView style={trackingData && isStatusActive(trackingData.status, 'out_for_delivery') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
            <Ionicons name="bicycle" size={16} color={trackingData && isStatusActive(trackingData.status, 'out_for_delivery') ? '#fff' : colors.textTertiary} />
          </RView>
          <RView style={orderTrackingStyles.statusContent}>
            <Text style={[orderTrackingStyles.statusLabel, trackingData && !isStatusActive(trackingData.status, 'out_for_delivery') && { color: colors.textTertiary }]}>
              {t('orders.status.outForDelivery')}
            </Text>
            <Text style={orderTrackingStyles.statusTime}>
              {trackingData ? getStatusTimeText(trackingData.status, 'out_for_delivery') : t('orderTracking.pending')}
            </Text>
          </RView>
        </RView>

        <RView style={orderTrackingStyles.statusLine} />

        {/* Delivered */}
        <RView style={orderTrackingStyles.statusItem}>
          <RView style={trackingData && isStatusActive(trackingData.status, 'delivered') ? orderTrackingStyles.statusIconActive : orderTrackingStyles.statusIcon}>
            <Ionicons name="home" size={16} color={trackingData && isStatusActive(trackingData.status, 'delivered') ? '#fff' : colors.textTertiary} />
          </RView>
          <RView style={orderTrackingStyles.statusContent}>
            <Text style={[orderTrackingStyles.statusLabel, trackingData && !isStatusActive(trackingData.status, 'delivered') && { color: colors.textTertiary }]}>
              {t('orders.status.delivered')}
            </Text>
            <Text style={orderTrackingStyles.statusTime}>
              {trackingData ? getStatusTimeText(trackingData.status, 'delivered') : t('orderTracking.pending')}
            </Text>
          </RView>
        </RView>
      </RView>

      {/* Order Info */}
      <RView style={orderTrackingStyles.infoCard}>
        <RView style={orderTrackingStyles.infoRow}>
          <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
          <Text style={orderTrackingStyles.infoText}>
            {t('orderTracking.distance', { distance: distance.toString() })}
          </Text>
        </RView>
        <RView style={orderTrackingStyles.infoRow}>
          <Ionicons name="cash-outline" size={20} color={colors.textSecondary} />
          <Text style={orderTrackingStyles.infoText}>
            {t('orderTracking.payment')}
          </Text>
        </RView>
      </RView>

      {/* Cancel button - only show if order is not out for delivery or delivered */}
      {trackingData && trackingData.status !== 'out_for_delivery' && trackingData.status !== 'delivered' && (
        <Button
          title={t('orderTracking.cancelOrder')}
          onPress={onCancelOrder}
          variant="outline"
          style={[orderTrackingStyles.backButton, { borderColor: colors.error }]}
          textStyle={{ color: colors.error }}
        />
      )}

      <Button
        title={t('orderTracking.backToHome')}
        onPress={onBackToHome}
        variant="outline"
        style={orderTrackingStyles.backButton}
      />
    </ScrollView>
  );
};
