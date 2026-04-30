import { BookingSummary } from '@/components/dine/booking-summary';
import { DateTimeSelector } from '@/components/dine/date-time-selector';
import { DineInAlerts } from '@/components/dine/dine-in-alerts';
import { DineInSkeleton } from '@/components/dine/dine-in-skeleton';
import { SeatSelector } from '@/components/dine/seat-selector';
import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { DURATION_OPTIONS } from '@/constants/dine.constants';
import { dineService } from '@/services/dine.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { dineInStyles } from '@/styles/screens/dine-in.styles';
import { DineBooking, Seat } from '@/types/dine.types';
import {
  calculateBookingEndTime,
  getBookingSuccessMessage,
  isValidBookingTime
} from '@/utils/dineUtils';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DineIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return null;
  }
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [duration, setDuration] = useState(120); // Default 2 hours
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', message: '' });
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    try {
      setIsLoading(true);
      const fetchedSeats = await dineService.getSeats();
      setSeats(fetchedSeats);
    } catch (error) {
      console.error('Error loading seats:', error);
      setErrorMessage({
        title: 'Error',
        message: 'Failed to load seats. Please try again.',
      });
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeat) {
      setErrorMessage({
        title: 'No Seat Selected',
        message: 'Please select a seat to continue.',
      });
      setShowErrorAlert(true);
      return;
    }

    if (!cart || cart.items.length === 0) {
      setErrorMessage({
        title: 'Empty Cart',
        message: 'Please add items to your cart first.',
      });
      setShowErrorAlert(true);
      return;
    }

    // Check if selected date/time is in the past
    if (!isValidBookingTime(selectedDateTime)) {
      setErrorMessage({
        title: 'Invalid Time',
        message: 'Please select a future date and time.',
      });
      setShowErrorAlert(true);
      return;
    }

    setShowConfirmAlert(true);
  };

  const handleConfirmBookingAction = async () => {
    if (!selectedSeat || !cart) return;

    setIsBooking(true);
    try {
      const bookedUntil = calculateBookingEndTime(selectedDateTime, duration);

      const bookingData: Omit<DineBooking, 'id'> = {
        userId: user.id.toString(),
        userName: user.name,
        seatNumber: selectedSeat.number,
        seatId: selectedSeat.id,
        bookedAt: selectedDateTime.toISOString(),
        bookedUntil: bookedUntil.toISOString(),
        status: 'active',
        cartItems: cart.items.map(item => ({
          id: item.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity,
          image: item.menuItem.image,
        })),
        totalAmount: cart.totalAmount,
      };

      await dineService.createBooking(bookingData);

      // Clear cart after successful booking
      dispatch(clearCart(user.id.toString()));

      const message = getBookingSuccessMessage(
        selectedSeat.number,
        selectedDateTime
      );
      setSuccessMessage(message);
      setShowSuccessAlert(true);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setErrorMessage({
        title: 'Booking Failed',
        message: error.message || 'Failed to book seat. Please try again.',
      });
      setShowErrorAlert(true);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={dineInStyles.container}>
        <DineInSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dineInStyles.container}>
      <ScrollView contentContainerStyle={dineInStyles.scrollContent}>
        <RView style={dineInStyles.header}>
          <Text variant="title" style={dineInStyles.title}>
            Dine In Booking
          </Text>
          <Text variant="body" style={dineInStyles.subtitle}>
            Select date, time, seat and duration for your dining experience
          </Text>
        </RView>

        <DateTimeSelector
          selectedDate={selectedDateTime}
          onDateChange={setSelectedDateTime}
        />

        <SeatSelector
          seats={seats}
          selectedSeatId={selectedSeat?.id || null}
          onSelectSeat={handleSelectSeat}
        />

        <Card style={dineInStyles.durationSelector}>
          <Text variant="subtitle" style={dineInStyles.durationTitle}>
            Select Duration
          </Text>
          <RView style={dineInStyles.durationOptions}>
            {DURATION_OPTIONS.map((option) => {
              const isSelected = duration === option.value;
              return (
                <PressableView
                  key={option.value}
                  style={[
                    dineInStyles.durationButton,
                    isSelected && dineInStyles.durationButtonSelected,
                  ]}
                  onPress={() => setDuration(option.value)}
                >
                  <Text
                    variant="body"
                    style={[
                      dineInStyles.durationText,
                      isSelected && dineInStyles.durationTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </PressableView>
              );
            })}
          </RView>
        </Card>

        <BookingSummary
          selectedDateTime={selectedDateTime}
          totalItems={cart?.totalItems || 0}
          selectedSeat={selectedSeat}
          duration={duration}
          totalAmount={cart?.totalAmount || 0}
          isBooking={isBooking}
          onConfirmBooking={handleConfirmBooking}
        />
      </ScrollView>

      <DineInAlerts
        showErrorAlert={showErrorAlert}
        errorTitle={errorMessage.title}
        errorMessage={errorMessage.message}
        onDismissError={() => setShowErrorAlert(false)}
        showConfirmAlert={showConfirmAlert}
        selectedSeatNumber={selectedSeat?.number || null}
        selectedDateTime={selectedDateTime}
        duration={duration}
        onConfirmBooking={() => {
          setShowConfirmAlert(false);
          handleConfirmBookingAction();
        }}
        onDismissConfirm={() => setShowConfirmAlert(false)}
        showSuccessAlert={showSuccessAlert}
        successMessage={successMessage}
        onSuccessConfirm={() => {
          setShowSuccessAlert(false);
          router.back();
        }}
        onDismissSuccess={() => {
          setShowSuccessAlert(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}
