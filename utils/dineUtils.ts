/**
 * Format date for display
 */
export const formatBookingDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format time for display
 */
export const formatBookingTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format duration in hours
 */
export const formatDuration = (minutes: number): string => {
  const hours = minutes / 60;
  return `${hours} hour${hours > 1 ? 's' : ''}`;
};

/**
 * Validate if booking date/time is in the future
 */
export const isValidBookingTime = (selectedDateTime: Date): boolean => {
  return selectedDateTime > new Date();
};

/**
 * Calculate booking end time
 */
export const calculateBookingEndTime = (startTime: Date, durationMinutes: number): Date => {
  return new Date(startTime.getTime() + durationMinutes * 60 * 1000);
};

/**
 * Format booking confirmation message
 */
export const getBookingConfirmationMessage = (
  seatNumber: number,
  date: Date,
  durationMinutes: number
): string => {
  const formattedDate = formatBookingDate(date);
  const formattedTime = formatBookingTime(date);
  const duration = formatDuration(durationMinutes);
  
  return `Book Seat ${seatNumber} on ${formattedDate} at ${formattedTime} for ${duration}?`;
};

/**
 * Format booking success message
 */
export const getBookingSuccessMessage = (
  seatNumber: number,
  date: Date
): string => {
  const formattedDate = formatBookingDate(date);
  const formattedTime = formatBookingTime(date);
  
  return `Your seat ${seatNumber} is booked for ${formattedDate} at ${formattedTime}. Enjoy your meal!`;
};
