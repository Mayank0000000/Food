import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { myBookingsStyles } from '@/styles/screens/my-bookings.styles';
import { DineBooking } from '@/types/dine.types';
import {
    formatDate,
    formatTime,
    getDuration,
    getStatusColor,
    getStatusText,
    isBookingActive,
} from '@/utils/bookingUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface BookingItemProps {
  booking: DineBooking;
  onCancel: (booking: DineBooking) => void;
}

export const BookingItem: React.FC<BookingItemProps> = ({ booking, onCancel }) => {
  const statusColor = getStatusColor(booking);
  const statusText = getStatusText(booking);
  const active = isBookingActive(booking);

  return (
    <Card style={myBookingsStyles.bookingCard}>
      <RView style={myBookingsStyles.bookingHeader}>
        <RView style={myBookingsStyles.seatInfo}>
          <RView style={[myBookingsStyles.seatBadge, { backgroundColor: statusColor }]}>
            <Ionicons name="restaurant" size={20} color="#fff" />
            <Text variant="body" style={myBookingsStyles.seatNumber}>
              Seat {booking.seatNumber}
            </Text>
          </RView>
          <RView style={[myBookingsStyles.statusBadge, { backgroundColor: statusColor }]}>
            <Text variant="caption" style={myBookingsStyles.statusText}>
              {statusText}
            </Text>
          </RView>
        </RView>
      </RView>

      <RView style={myBookingsStyles.bookingDetails}>
        <RView style={myBookingsStyles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text variant="body" style={myBookingsStyles.detailText}>
            {formatDate(booking.bookedAt)}
          </Text>
        </RView>

        <RView style={myBookingsStyles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text variant="body" style={myBookingsStyles.detailText}>
            {formatTime(booking.bookedAt)} - {formatTime(booking.bookedUntil)}
          </Text>
        </RView>

        <RView style={myBookingsStyles.detailRow}>
          <Ionicons name="hourglass-outline" size={16} color="#666" />
          <Text variant="body" style={myBookingsStyles.detailText}>
            {getDuration(booking.bookedAt, booking.bookedUntil)}
          </Text>
        </RView>

        <RView style={myBookingsStyles.detailRow}>
          <Ionicons name="fast-food-outline" size={16} color="#666" />
          <Text variant="body" style={myBookingsStyles.detailText}>
            {booking.cartItems.length} item{booking.cartItems.length > 1 ? 's' : ''}
          </Text>
        </RView>
      </RView>

      <RView style={myBookingsStyles.bookingFooter}>
        <Text variant="subtitle" style={myBookingsStyles.totalAmount}>
          ₹{booking.totalAmount}
        </Text>
        {active && (
          <Button
            title="Cancel"
            variant="outline"
            size="small"
            onPress={() => onCancel(booking)}
            style={myBookingsStyles.cancelButton}
          />
        )}
      </RView>

      {/* Order Items */}
      {booking.cartItems.length > 0 && (
        <RView style={myBookingsStyles.itemsSection}>
          <Text variant="caption" style={myBookingsStyles.itemsTitle}>
            Order Items:
          </Text>
          {booking.cartItems.map((cartItem, index) => (
            <RView key={index} style={myBookingsStyles.itemRow}>
              <Text variant="caption" style={myBookingsStyles.itemName}>
                {cartItem.quantity}x {cartItem.name}
              </Text>
              <Text variant="caption" style={myBookingsStyles.itemPrice}>
                ₹{cartItem.price * cartItem.quantity}
              </Text>
            </RView>
          ))}
        </RView>
      )}
    </Card>
  );
};
