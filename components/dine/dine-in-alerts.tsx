import React from 'react';

import { Alert } from '@/components/ui/alert';
import { useCMS } from '@/hooks/useCMS';
import { DineInAlertsProps } from '@/types/dine.types';
import { getBookingConfirmationMessage } from '@/utils/dineUtils';

export const DineInAlerts: React.FC<DineInAlertsProps> = ({
  showErrorAlert,
  errorTitle,
  errorMessage,
  onDismissError,
  showConfirmAlert,
  selectedSeatNumber,
  selectedDateTime,
  duration,
  onConfirmBooking,
  onDismissConfirm,
  showSuccessAlert,
  successMessage,
  onSuccessConfirm,
  onDismissSuccess,
}) => {
  const { t } = useCMS();

  return (
    <>
      {/* Error Alert */}
      <Alert
        visible={showErrorAlert}
        title={errorTitle}
        message={errorMessage}
        buttons={[
          {
            text: t('common.ok'),
            onPress: onDismissError,
          },
        ]}
        onDismiss={onDismissError}
      />

      {/* Confirmation Alert */}
      <Alert
        visible={showConfirmAlert}
        title={t('dineIn.alerts.confirmTitle')}
        message={
          selectedSeatNumber
            ? getBookingConfirmationMessage(selectedSeatNumber, selectedDateTime, duration)
            : ''
        }
        buttons={[
          {
            text: t('dineIn.alerts.cancel'),
            style: 'cancel',
            onPress: onDismissConfirm,
          },
          {
            text: t('dineIn.alerts.confirm'),
            onPress: onConfirmBooking,
          },
        ]}
        onDismiss={onDismissConfirm}
      />

      {/* Success Alert */}
      <Alert
        visible={showSuccessAlert}
        title={t('dineIn.alerts.successTitle')}
        message={successMessage}
        buttons={[
          {
            text: t('dineIn.alerts.ok'),
            onPress: onSuccessConfirm,
          },
        ]}
        onDismiss={onDismissSuccess}
      />
    </>
  );
};
