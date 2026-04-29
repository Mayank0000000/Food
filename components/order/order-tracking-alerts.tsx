import { Alert } from '@/components/ui/alert';
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
  return (
    <>
      {/* Delivered Alert */}
      <Alert
        visible={showDeliveredAlert}
        title="Order Delivered! 🎉"
        message="Your order has been delivered successfully. Enjoy your meal!"
        buttons={[
          {
            text: 'OK',
            onPress: onDeliveredConfirm,
          },
        ]}
        onDismiss={onDismissDelivered}
      />

      {/* Leave Tracking Alert */}
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
            onPress: onLeaveConfirm,
          },
        ]}
        onDismiss={onDismissLeave}
      />

      {/* Cancel Order Alert */}
      <Alert
        visible={showCancelAlert}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        buttons={[
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: onCancelConfirm,
          },
        ]}
        onDismiss={onDismissCancel}
      />
    </>
  );
};
