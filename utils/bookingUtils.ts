import { DineBooking } from '@/types/dine.types';

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format time for display
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate duration between two dates
 */
export const getDuration = (bookedAt: string, bookedUntil: string): string => {
  const start = new Date(bookedAt);
  const end = new Date(bookedUntil);
  const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  return `${hours} hour${hours > 1 ? 's' : ''}`;
};

/**
 * Check if booking is currently active
 */
export const isBookingActive = (booking: DineBooking): boolean => {
  return booking.status === 'active' && new Date(booking.bookedUntil) > new Date();
};

/**
 * Get status color based on booking status
 */
export const getStatusColor = (booking: DineBooking): string => {
  if (booking.status === 'cancelled') return '#EF4444';
  if (booking.status === 'completed') return '#6B7280';
  if (isBookingActive(booking)) return '#22C55E';
  return '#F59E0B'; // Expired
};

/**
 * Get status text based on booking status
 */
export const getStatusText = (booking: DineBooking): string => {
  if (booking.status === 'cancelled') return 'Cancelled';
  if (booking.status === 'completed') return 'Completed';
  if (isBookingActive(booking)) return 'Active';
  return 'Expired';
};
