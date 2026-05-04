import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
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
  const { t } = useCMS();

  return (
    <>
      <Card style={dineInStyles.orderSummary}>
        <Text variant="subtitle" style={dineInStyles.summaryTitle}>
          {t('dineIn.bookingSummary')}
        </Text>

        <RView style={dineInStyles.summaryRow}>
          <Text variant="body" style={dineInStyles.summaryLabel}>
            {t('dineIn.dateTime')}
          </Text>
          <Text variant="body" style={dineInStyles.summaryValue}>
            {formatBookingDate(selectedDateTime)} at {formatBookingTime(selectedDateTime)}
          </Text>
        </RView>

        <RView style={dineInStyles.summaryRow}>
          <Text variant="body" style={dineInStyles.summaryLabel}>
            {t('dineIn.items')}
          </Text>
          <Text variant="body" style={dineInStyles.summaryValue}>
            {totalItems}
          </Text>
        </RView>

        {selectedSeat && (
          <RView style={dineInStyles.summaryRow}>
            <Text variant="body" style={dineInStyles.summaryLabel}>
              {t('dineIn.seatNumber')}
            </Text>
            <Text variant="body" style={dineInStyles.summaryValue}>
              {selectedSeat.number} ({selectedSeat.type})
            </Text>
          </RView>
        )}

        <RView style={dineInStyles.summaryRow}>
          <Text variant="body" style={dineInStyles.summaryLabel}>
            {t('dineIn.duration')}
          </Text>
          <Text variant="body" style={dineInStyles.summaryValue}>
            {t('dineIn.hours', { count: (duration / 60).toString() })}
          </Text>
        </RView>

        <RView style={[dineInStyles.summaryRow, dineInStyles.totalRow]}>
          <Text variant="subtitle" style={dineInStyles.totalLabel}>
            {t('dineIn.totalAmount')}
          </Text>
          <Text variant="subtitle" style={dineInStyles.totalValue}>
            ₹{totalAmount}
          </Text>
        </RView>
      </Card>

      <RView style={dineInStyles.footer}>
        <Button
          title={selectedSeat 
            ? t('dineIn.confirmBooking', { number: selectedSeat.number.toString() })
            : t('dineIn.selectASeat')
          }
          onPress={onConfirmBooking}
          disabled={!selectedSeat || isBooking}
          loading={isBooking}
          style={dineInStyles.confirmButton}
        />
      </RView>
    </>
  );
};
