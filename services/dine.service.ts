import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { DineBooking, Seat } from '@/types/dine.types';
import { githubService } from './github.service';

class DineService {
  private readonly DINE_FILE = API_ENDPOINTS.FILES.DINE;

  async getSeats(): Promise<Seat[]> {
    try {
      const response = await githubService.getFile(this.DINE_FILE);
      const bookings: DineBooking[] = response || [];
      
      // Generate seats (1-20)
      const seats: Seat[] = [];
      for (let i = 1; i <= 20; i++) {
        const seatType = i <= 8 ? 'single' : i <= 16 ? 'double' : 'family';
        const capacity = seatType === 'single' ? 1 : seatType === 'double' ? 2 : 4;
        
        // Check if seat is booked
        const activeBooking = bookings.find(
          booking => 
            booking.seatNumber === i && 
            booking.status === 'active' &&
            new Date(booking.bookedUntil) > new Date()
        );
        
        seats.push({
          id: `seat-${i}`,
          number: i,
          type: seatType,
          capacity,
          isAvailable: !activeBooking,
          bookedBy: activeBooking?.userId,
          bookedAt: activeBooking?.bookedAt,
          bookedUntil: activeBooking?.bookedUntil,
        });
      }
      
      return seats;
    } catch (error) {
      console.error('Error fetching seats:', error);
      return [];
    }
  }

  async createBooking(booking: Omit<DineBooking, 'id'>): Promise<DineBooking> {
    try {
      const response = await githubService.getFile(this.DINE_FILE);
      const bookings: DineBooking[] = response || [];
      
      // Check if seat is still available
      const existingBooking = bookings.find(
        b => 
          b.seatNumber === booking.seatNumber && 
          b.status === 'active' &&
          new Date(b.bookedUntil) > new Date()
      );
      
      if (existingBooking) {
        throw new Error('Seat is already booked');
      }
      
      const newBooking: DineBooking = {
        ...booking,
        id: `booking-${Date.now()}`,
      };
      
      bookings.push(newBooking);
      
      await githubService.updateFile(
        this.DINE_FILE,
        bookings,
        `Create dine-in booking for seat ${booking.seatNumber}`
      );
      
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getUserBookings(userId: string): Promise<DineBooking[]> {
    try {
      const response = await githubService.getFile(this.DINE_FILE);
      const bookings: DineBooking[] = response || [];
      
      return bookings.filter(b => b.userId === userId);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  async cancelBooking(bookingId: string): Promise<void> {
    try {
      const response = await githubService.getFile(this.DINE_FILE);
      const bookings: DineBooking[] = response || [];
      
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex >= 0) {
        bookings[bookingIndex].status = 'cancelled';
        
        await githubService.updateFile(
          this.DINE_FILE,
          bookings,
          `Cancel booking ${bookingId}`
        );
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
}

export const dineService = new DineService();
