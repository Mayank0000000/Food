import { TrackingStatus } from '@/types/order.types';

/**
 * Get human-readable status text
 */
export const getStatusText = (status: TrackingStatus): string => {
  switch (status) {
    case 'confirmed':
      return 'Order Confirmed';
    case 'preparing':
      return 'Preparing Your Order';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return 'Processing';
  }
};

/**
 * Check if a status is active based on current order status
 */
export const isStatusActive = (
  currentStatus: TrackingStatus,
  checkStatus: TrackingStatus
): boolean => {
  const statusOrder: TrackingStatus[] = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const checkIndex = statusOrder.indexOf(checkStatus);
  return checkIndex <= currentIndex;
};

/**
 * Get status time text
 */
export const getStatusTimeText = (
  currentStatus: TrackingStatus,
  checkStatus: TrackingStatus
): string => {
  if (currentStatus === checkStatus) {
    return 'In progress';
  }
  return isStatusActive(currentStatus, checkStatus) ? 'Completed' : 'Pending';
};
