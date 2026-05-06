import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/hooks/useTheme';
import { createMyBookingsStyles } from '@/styles/screens/my-bookings.styles';
import React, { useMemo } from 'react';

export const BookingsSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const myBookingsStyles = useMemo(() => createMyBookingsStyles(theme), [theme]);
  
  return (
    <RView style={myBookingsStyles.listContent}>
      {[1, 2, 3].map((index) => (
        <Card key={index} style={myBookingsStyles.bookingCard}>
          {/* Header with seat badge and status */}
          <RView style={myBookingsStyles.bookingHeader}>
            <RView style={myBookingsStyles.seatInfo}>
              <Skeleton width={120} height={40} borderRadius={20} />
              <Skeleton width={80} height={24} borderRadius={12} style={{ marginLeft: 8 }} />
            </RView>
          </RView>

          {/* Booking details */}
          <RView style={myBookingsStyles.bookingDetails}>
            <RView style={myBookingsStyles.detailRow}>
              <Skeleton width={16} height={16} borderRadius={8} />
              <Skeleton width={150} height={16} style={{ marginLeft: 8 }} />
            </RView>

            <RView style={myBookingsStyles.detailRow}>
              <Skeleton width={16} height={16} borderRadius={8} />
              <Skeleton width={180} height={16} style={{ marginLeft: 8 }} />
            </RView>

            <RView style={myBookingsStyles.detailRow}>
              <Skeleton width={16} height={16} borderRadius={8} />
              <Skeleton width={100} height={16} style={{ marginLeft: 8 }} />
            </RView>

            <RView style={myBookingsStyles.detailRow}>
              <Skeleton width={16} height={16} borderRadius={8} />
              <Skeleton width={80} height={16} style={{ marginLeft: 8 }} />
            </RView>
          </RView>

          {/* Footer with total and button */}
          <RView style={myBookingsStyles.bookingFooter}>
            <Skeleton width={80} height={24} />
            <Skeleton width={80} height={36} borderRadius={8} />
          </RView>

          {/* Order items section */}
          <RView style={myBookingsStyles.itemsSection}>
            <Skeleton width={100} height={14} style={{ marginBottom: 8 }} />
            <RView style={myBookingsStyles.itemRow}>
              <Skeleton width={120} height={14} />
              <Skeleton width={60} height={14} />
            </RView>
            <RView style={myBookingsStyles.itemRow}>
              <Skeleton width={140} height={14} />
              <Skeleton width={50} height={14} />
            </RView>
          </RView>
        </Card>
      ))}
    </RView>
  );
};
