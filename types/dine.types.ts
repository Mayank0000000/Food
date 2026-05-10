export interface Seat {
  id: string;
  number: number;
  type: 'single' | 'double' | 'family';
  capacity: number;
  isAvailable: boolean;
  bookedBy?: string;
  bookedAt?: string;
  bookedUntil?: string;
}

export interface DineBooking {
  id: string;
  userId: string;
  userName: string;
  seatId: string;
  seatNumber: number;
  bookedAt: string;
  bookedUntil: string;
  status: 'active' | 'completed' | 'cancelled';
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
}

export interface DineState {
  seats: Seat[];
  bookings: DineBooking[];
  currentBooking: DineBooking | null;
  isLoading: boolean;
  error: string | null;
}

export interface DineInAlertsProps {
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
