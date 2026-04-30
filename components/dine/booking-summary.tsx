import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { dineInStyles } from '@/styles/screens/dine-in.styles';
import { Seat } from '@/types/dine.types';
import { formatBookingDate, formatBookingTime } from '@/utils/dineUtils';
import React from 'react';

interface BookingSummaryProps {
  selectedDateTime: Date;
  totalItems: number;
  selectedSeat: Seat | null;
  duration: number;
  totalAmount: number;
  isBooking: boolean;
  onConfirmBooking: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedDateTime,
  totalItems,
  selectedSeat,
  duration,
  totalAmount,
  isBooking,
  onConfirmBooking,
}) => {
  return (
    <>
      <Card style={dineInStyles.orderSummary}>
        <Text variant="subtitle" style={dineInStyles.summaryTitle}>
          Booking Summary
        </Text>

        <RView style={dineInStyles.summaryRow}>
          <Text variant="body" style={dineInStyles.summaryLabel}>
            Date & Time
          </Text>
          <Text variant="body" style={dineInStyles.summaryValue}>
            {formatBookingDate(selectedDateTime)} at {formatBookingTime(selectedDateTime)}
          </Text>
        </RView>

        <RView style={dineInStyles.summaryRow}>
          <Text variant="body" style={dineInStyles.summaryLabel}>
            Items
          </Text>
          <Text variant="body" style={dineInStyles.summaryValue}>
            {totalItems}
          </Text>
        </RView>

        {selectedSeat && (
          <RView style={dineInStyles.summaryRow}>
            <Text variant="body" style={dineInStyles.summaryLabel}>
              Seat Number
            </Text>
            <Text variant="body" style={dineInStyles.summaryValue}>
              {selectedSeat.number} ({selectedSeat.type})
            </Text>
          </RView>
        )}

        <RView style={dineInStyles.summaryRow}>
          <Text variant="body" style={dineInStyles.summaryLabel}>
            Duration
          </Text>
          <Text variant="body" style={dineInStyles.summaryValue}>
            {duration / 60} hour(s)
          </Text>
        </RView>

        <RView style={[dineInStyles.summaryRow, dineInStyles.totalRow]}>
          <Text variant="subtitle" style={dineInStyles.totalLabel}>
            Total Amount
          </Text>
          <Text variant="subtitle" style={dineInStyles.totalValue}>
            ₹{totalAmount}
          </Text>
        </RView>
      </Card>

      <RView style={dineInStyles.footer}>
        <Button
          title={selectedSeat ? `Confirm Booking - Seat ${selectedSeat.number}` : 'Select a Seat'}
          onPress={onConfirmBooking}
          disabled={!selectedSeat || isBooking}
          loading={isBooking}
          style={dineInStyles.confirmButton}
        />
      </RView>
    </>
  );
};
