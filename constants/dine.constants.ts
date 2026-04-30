/**
 * Dine-in booking duration options
 */
export const DURATION_OPTIONS = [
  { label: '1 Hour', value: 60 },
  { label: '2 Hours', value: 120 },
  { label: '3 Hours', value: 180 },
] as const;

/**
 * Seat type definitions
 */
export const SEAT_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  FAMILY: 'family',
} as const;

/**
 * Booking status types
 */
export const BOOKING_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

/**
 * Maximum days in advance for booking
 */
export const MAX_BOOKING_DAYS_ADVANCE = 30;

/**
 * Time slot interval in minutes
 */
export const TIME_SLOT_INTERVAL = 15;
