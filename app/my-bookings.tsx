import { BookingItem } from '@/components/bookings/booking-item';
import { BookingsSkeleton } from '@/components/bookings/bookings-skeleton';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { dineService } from '@/services/dine.service';
import { useAppSelector } from '@/store/hooks';
import { createMyBookingsStyles } from '@/styles/screens/my-bookings.styles';
import { DineBooking } from '@/types/dine.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyBookings() {
  const { t } = useCMS();
  const router = useRouter();
  const { theme, colors } = useTheme();
  const myBookingsStyles = useMemo(() => createMyBookingsStyles(theme), [theme]);
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
      setErrorMessage(t('bookings.alerts.errorMessage'));
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
      setErrorMessage(t('bookings.alerts.cancelError'));
      setShowErrorAlert(true);
    }
  };

  const renderBookingItem = ({ item }: { item: DineBooking }) => {
    return <BookingItem booking={item} onCancel={handleCancelBooking} />;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={myBookingsStyles.container}>
        <ScreenHeader title={t('bookings.title')} />
        <BookingsSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={myBookingsStyles.container}>
      <ScreenHeader title={t('bookings.title')} />

      {bookings.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title={t('bookings.emptyTitle')}
          subtitle={t('bookings.emptySubtitle')}
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
              colors={[colors.primary]}
            />
          }
        />
      )}

      {/* Error Alert */}
      <Alert
        visible={showErrorAlert}
        title={t('bookings.alerts.errorTitle')}
        message={errorMessage}
        buttons={[
          {
            text: t('common.ok'),
            onPress: () => setShowErrorAlert(false),
          },
        ]}
        onDismiss={() => setShowErrorAlert(false)}
      />

      {/* Cancel Confirmation Alert */}
      <Alert
        visible={showCancelConfirm}
        title={t('bookings.alerts.cancelTitle')}
        message={
          bookingToCancel
            ? t('bookings.alerts.cancelMessage')
            : ''
        }
        buttons={[
          {
            text: t('common.no'),
            style: 'cancel',
            onPress: () => {
              setShowCancelConfirm(false);
              setBookingToCancel(null);
            },
          },
          {
            text: t('bookings.cancel'),
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
        title={t('bookings.alerts.cancelSuccess')}
        message={t('bookings.alerts.cancelSuccessMessage')}
        buttons={[
          {
            text: t('common.ok'),
            onPress: () => setShowSuccessAlert(false),
          },
        ]}
        onDismiss={() => setShowSuccessAlert(false)}
      />
    </SafeAreaView>
  );
}
