import { Location, TrackingStatus } from '@/types/order.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@order_tracking';
const STORAGE_PATH_KEY = '@order_path';
const DELIVERY_DURATION = 120000; // 2 minutes in milliseconds
const UPDATE_INTERVAL = 500; // Update every 500ms for smoother animation

export interface OrderTrackingData {
  orderId: string;
  currentLocation: Location;
  status: TrackingStatus;
  progress: number; // 0 to 1
  startTime: number;
  estimatedDeliveryTime: number;
  pathIndex: number; // Current index in the path array
}

/**
 * Get location along path based on progress
 */
const getLocationAlongPath = (
  path: Location[],
  progress: number
): { location: Location; pathIndex: number } => {
  if (path.length === 0) {
    return { location: path[0] || { latitude: 0, longitude: 0 }, pathIndex: 0 };
  }

  const totalIndex = (path.length - 1) * progress;
  const pathIndex = Math.floor(totalIndex);
  const segmentProgress = totalIndex - pathIndex;

  if (pathIndex >= path.length - 1) {
    return { location: path[path.length - 1], pathIndex: path.length - 1 };
  }

  const start = path[pathIndex];
  const end = path[pathIndex + 1];

  return {
    location: {
      latitude: start.latitude + (end.latitude - start.latitude) * segmentProgress,
      longitude: start.longitude + (end.longitude - start.longitude) * segmentProgress,
    },
    pathIndex,
  };
};


const getStatusFromTime = (elapsedSeconds: number): TrackingStatus => {
  if (elapsedSeconds < 10) return 'confirmed'; // 0-10s: Order confirmed
  if (elapsedSeconds < 30) return 'preparing'; // 10-30s: Preparing
  if (elapsedSeconds < 120) return 'out_for_delivery'; // 30s-2:00: Out for delivery
  return 'delivered'; // 2:00+: Delivered
};

const getDeliveryProgress = (elapsedSeconds: number): number => {
  if (elapsedSeconds < 30) return 0; // Not started yet (confirmed/preparing)
  if (elapsedSeconds >= 120) return 1; // Completed
  
  // Progress from 30s to 120s (90 seconds of movement)
  const deliveryTime = elapsedSeconds - 30;
  const totalDeliveryTime = 90; // 120 - 30
  return deliveryTime / totalDeliveryTime;
};

/**
 * Start simulated delivery tracking
 */
export const startDeliverySimulation = async (
  orderId: string,
  restaurantLocation: Location,
  deliveryLocation: Location,
  path?: Location[],
  customStartTime?: number
): Promise<void> => {
  const startTime = customStartTime || Date.now();
  const estimatedDeliveryTime = startTime + DELIVERY_DURATION;

  // Store the path if provided
  if (path && path.length > 0) {
    await AsyncStorage.setItem(STORAGE_PATH_KEY, JSON.stringify(path));
  }

  const trackingData: OrderTrackingData = {
    orderId,
    currentLocation: restaurantLocation,
    status: 'confirmed',
    progress: 0,
    startTime,
    estimatedDeliveryTime,
    pathIndex: 0,
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
};

/**
 * Update delivery position (called by interval)
 */
export const updateDeliveryPosition = async (
  restaurantLocation: Location,
  deliveryLocation: Location
): Promise<OrderTrackingData | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const trackingData: OrderTrackingData = JSON.parse(stored);
    const now = Date.now();
    const elapsed = now - trackingData.startTime;
    const elapsedSeconds = elapsed / 1000;
    const overallProgress = Math.min(elapsed / DELIVERY_DURATION, 1);

    // Get delivery progress (only moves during 30s-120s)
    const deliveryProgress = getDeliveryProgress(elapsedSeconds);

    // Try to get stored path
    const pathStored = await AsyncStorage.getItem(STORAGE_PATH_KEY);
    let currentLocation: Location;
    let pathIndex = 0;

    if (deliveryProgress === 0) {
      // Still preparing - stay at restaurant
      currentLocation = restaurantLocation;
      pathIndex = 0;
    } else if (pathStored) {
      // Moving along path
      const path: Location[] = JSON.parse(pathStored);
      const result = getLocationAlongPath(path, deliveryProgress);
      currentLocation = result.location;
      pathIndex = result.pathIndex;
    } else {
      // Fallback to straight line if no path
      currentLocation = {
        latitude: restaurantLocation.latitude + 
          (deliveryLocation.latitude - restaurantLocation.latitude) * deliveryProgress,
        longitude: restaurantLocation.longitude + 
          (deliveryLocation.longitude - restaurantLocation.longitude) * deliveryProgress,
      };
    }

    const updatedData: OrderTrackingData = {
      ...trackingData,
      currentLocation,
      status: getStatusFromTime(elapsedSeconds),
      progress: overallProgress,
      pathIndex,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error updating delivery position:', error);
    return null;
  }
};

/**
 * Get current tracking data
 */
export const getTrackingData = async (): Promise<OrderTrackingData | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting tracking data:', error);
    return null;
  }
};

/**
 * Clear tracking data (order completed)
 */
export const clearTrackingData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(STORAGE_PATH_KEY);
  } catch (error) {
    console.error('Error clearing tracking data:', error);
  }
};

/**
 * Get remaining time in seconds
 */
export const getRemainingTime = (trackingData: OrderTrackingData): number => {
  const now = Date.now();
  const remaining = trackingData.estimatedDeliveryTime - now;
  return Math.max(0, Math.ceil(remaining / 1000));
};

/**
 * Format time as MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
