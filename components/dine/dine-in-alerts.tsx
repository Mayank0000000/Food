import { Alert } from '@/components/ui/alert';
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
  return (
    <>
      {/* Error Alert */}
      <Alert
        visible={showErrorAlert}
        title={errorTitle}
        message={errorMessage}
        buttons={[
          {
            text: 'OK',
            onPress: onDismissError,
          },
        ]}
        onDismiss={onDismissError}
      />

      {/* Confirmation Alert */}
      <Alert
        visible={showConfirmAlert}
        title="Confirm Booking"
        message={
          selectedSeatNumber
            ? getBookingConfirmationMessage(selectedSeatNumber, selectedDateTime, duration)
            : ''
        }
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: onDismissConfirm,
          },
          {
            text: 'Confirm',
            onPress: onConfirmBooking,
          },
        ]}
        onDismiss={onDismissConfirm}
      />

      {/* Success Alert */}
      <Alert
        visible={showSuccessAlert}
        title="Booking Confirmed!"
        message={successMessage}
        buttons={[
          {
            text: 'OK',
            onPress: onSuccessConfirm,
          },
        ]}
        onDismiss={onDismissSuccess}
      />
    </>
  );
};
