import { Alert } from '@/components/ui/alert';
import { useCMS } from '@/hooks/useCMS';
import { getBookingConfirmationMessage } from '@/utils/dineUtils';
import React from 'react';

interface DineInAlertsProps {
  // Error alert
  showErrorAlert: boolean;
  errorTitle: string;
  errorMessage: string;
  onDismissError: () => void;

  // Confirmation alert
  showConfirmAlert: boolean;
  selectedSeatNumber: number | null;
  selectedDateTime: Date;
  duration: number;
  onConfirmBooking: () => void;
  onDismissConfirm: () => void;

  // Success alert
  showSuccessAlert: boolean;
  successMessage: string;
  onSuccessConfirm: () => void;
  onDismissSuccess: () => void;
}

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
