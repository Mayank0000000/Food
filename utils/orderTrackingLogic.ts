import { Location, TrackingStatus } from '@/types/order.types';
import { OrderTrackingData } from './orderSimulation';

/**
 * Calculate delivery progress based on elapsed time
 * Progress only happens during delivery phase (30s-120s)
 */
export const getDeliveryProgressFromTime = (elapsedSeconds: number): number => {
  if (elapsedSeconds < 30) return 0; // Not started yet (confirmed/preparing)
  if (elapsedSeconds >= 120) return 1; // Completed
  
  // Progress from 30s to 120s (90 seconds of movement)
  const deliveryTime = elapsedSeconds - 30;
  const totalDeliveryTime = 90; // 120 - 30
  return deliveryTime / totalDeliveryTime;
};

/**
 * Get tracking status based on elapsed time
 */
export const getTrackingStatusFromTime = (
  elapsedSeconds: number
): TrackingStatus => {
  if (elapsedSeconds < 10) return 'confirmed'; // 0-10s: Order confirmed
  if (elapsedSeconds < 30) return 'preparing'; // 10-30s: Preparing
  if (elapsedSeconds < 120) return 'out_for_delivery'; // 30s-2:00: Out for delivery
  return 'delivered'; // 2:00+: Delivered
};

/**
 * Calculate current location along path based on progress
 */
export const calculateLocationAlongPath = (
  path: Location[],
  deliveryProgress: number,
  restaurant: Location
): { location: Location; pathIndex: number } => {
  if (deliveryProgress === 0 || path.length === 0) {
    return { location: restaurant, pathIndex: 0 };
  }

  const totalIndex = (path.length - 1) * deliveryProgress;
  const pathIndex = Math.floor(totalIndex);
  const segmentProgress = totalIndex - pathIndex;

  if (pathIndex >= path.length - 1) {
    return {
      location: path[path.length - 1],
      pathIndex: path.length - 1,
    };
  }

  const start = path[pathIndex];
  const end = path[pathIndex + 1];

  const location = {
    latitude: start.latitude + (end.latitude - start.latitude) * segmentProgress,
    longitude: start.longitude + (end.longitude - start.longitude) * segmentProgress,
  };

  return { location, pathIndex };
};

/**
 * Calculate tracking data based on order creation time
 */
export const calculateTrackingData = (
  orderId: string,
  orderCreatedAt: string,
  path: Location[],
  restaurant: Location,
  delivery: Location
): OrderTrackingData | null => {
  const createdTime = new Date(orderCreatedAt).getTime();
  const now = Date.now();
  const elapsed = now - createdTime;
  const elapsedSeconds = elapsed / 1000;



  // If order is delivered (>120 seconds)
  if (elapsedSeconds >= 120) {
    return {
      orderId,
      currentLocation: delivery,
      status: 'delivered',
      progress: 1,
      startTime: createdTime,
      estimatedDeliveryTime: createdTime + 120000,
      pathIndex: path.length - 1,
    };
  }

  // Calculate current position
  const progress = Math.min(elapsed / 120000, 1);
  const deliveryProgress = getDeliveryProgressFromTime(elapsedSeconds);
  const status = getTrackingStatusFromTime(elapsedSeconds);


  const { location: currentLocation, pathIndex } = calculateLocationAlongPath(
    path,
    deliveryProgress,
    restaurant
  );


  return {
    orderId,
    currentLocation,
    status,
    progress,
    startTime: createdTime,
    estimatedDeliveryTime: createdTime + 120000,
    pathIndex,
  };
};

/**
 * Calculate remaining time in seconds
 */
export const calculateRemainingTime = (elapsedSeconds: number): number => {
  return Math.max(0, Math.ceil(120 - elapsedSeconds));
};
