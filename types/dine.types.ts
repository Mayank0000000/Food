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
