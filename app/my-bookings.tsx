import { BookingItem } from '@/components/bookings/booking-item';
import { BookingsSkeleton } from '@/components/bookings/bookings-skeleton';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { dineService } from '@/services/dine.service';
import { useAppSelector } from '@/store/hooks';
import { myBookingsStyles } from '@/styles/screens/my-bookings.styles';
import { DineBooking } from '@/types/dine.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyBookings() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [bookings, setBookings] = useState<DineBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Alert states
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<DineBooking | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userBookings = await dineService.getUserBookings(user.id.toString());
      // Sort by booking date (newest first)
      const sortedBookings = userBookings.sort(
        (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setErrorMessage('Failed to load bookings. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  };

  const handleCancelBooking = (booking: DineBooking) => {
    setBookingToCancel(booking);
    setShowCancelConfirm(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      await dineService.cancelBooking(bookingToCancel.id);
      setShowCancelConfirm(false);
      setShowSuccessAlert(true);
      loadBookings();
    } catch (error) {
      setShowCancelConfirm(false);
      setErrorMessage('Failed to cancel booking. Please try again.');
      setShowErrorAlert(true);
    }
  };

  const renderBookingItem = ({ item }: { item: DineBooking }) => {
    return <BookingItem booking={item} onCancel={handleCancelBooking} />;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={myBookingsStyles.container}>
        <ScreenHeader title="My Bookings" />
        <BookingsSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={myBookingsStyles.container}>
      <ScreenHeader title="My Bookings" />

      {bookings.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No bookings yet"
          subtitle="Book a table to see your reservations here"
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={myBookingsStyles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#FF6B35']}
            />
          }
        />
      )}

      {/* Error Alert */}
      <Alert
        visible={showErrorAlert}
        title="Error"
        message={errorMessage}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowErrorAlert(false),
          },
        ]}
        onDismiss={() => setShowErrorAlert(false)}
      />

      {/* Cancel Confirmation Alert */}
      <Alert
        visible={showCancelConfirm}
        title="Cancel Booking"
        message={
          bookingToCancel
            ? `Are you sure you want to cancel your booking for Seat ${bookingToCancel.seatNumber}?`
            : ''
        }
        buttons={[
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {
              setShowCancelConfirm(false);
              setBookingToCancel(null);
            },
          },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: confirmCancelBooking,
          },
        ]}
        onDismiss={() => {
          setShowCancelConfirm(false);
          setBookingToCancel(null);
        }}
      />

      {/* Success Alert */}
      <Alert
        visible={showSuccessAlert}
        title="Success"
        message="Booking cancelled successfully"
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowSuccessAlert(false),
          },
        ]}
        onDismiss={() => setShowSuccessAlert(false)}
      />
    </SafeAreaView>
  );
}
