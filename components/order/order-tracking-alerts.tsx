import { Alert } from '@/components/ui/alert';
import { useCMS } from '@/hooks/useCMS';
import { OrderTrackingAlertsProps } from '@/types/components/order-tracking-alerts.types';
import React from 'react';

export const OrderTrackingAlerts: React.FC<OrderTrackingAlertsProps> = ({
  showDeliveredAlert,
  showLeaveAlert,
  showCancelAlert,
  onDeliveredConfirm,
  onLeaveConfirm,
  onCancelConfirm,
  onDismissDelivered,
  onDismissLeave,
  onDismissCancel,
}) => {
  const { t } = useCMS();

  return (
    <>
      {/* Delivered Alert */}
      <Alert
        visible={showDeliveredAlert}
        title={t('orderTracking.alerts.deliveredTitle')}
        message={t('orderTracking.alerts.deliveredMessage')}
        buttons={[
          {
            text: t('orderTracking.alerts.ok'),
            onPress: onDeliveredConfirm,
          },
        ]}
        onDismiss={onDismissDelivered}
      />

      {/* Leave Tracking Alert */}
      <Alert
        visible={showLeaveAlert}
        title={t('orderTracking.alerts.leaveTitle')}
        message={t('orderTracking.alerts.leaveMessage')}
        buttons={[
          {
            text: t('orderTracking.alerts.no'),
            style: 'cancel',
          },
          {
            text: t('orderTracking.alerts.leave'),
            style: 'destructive',
            onPress: onLeaveConfirm,
          },
        ]}
        onDismiss={onDismissLeave}
      />

      {/* Cancel Order Alert */}
      <Alert
        visible={showCancelAlert}
        title={t('orderTracking.alerts.cancelTitle')}
        message={t('orderTracking.alerts.cancelMessage')}
        buttons={[
          {
            text: t('orderTracking.alerts.no'),
            style: 'cancel',
          },
          {
            text: t('orderTracking.alerts.yes'),
            style: 'destructive',
            onPress: onCancelConfirm,
          },
        ]}
        onDismiss={onDismissCancel}
      />
    </>
  );
};
