import * as Location from 'expo-location';

export interface LocationPermissionResult {
  granted: boolean;
  location?: Location.LocationObject;
  error?: string;
}

/**
 * Request location permission and get current location
 */
export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  try {
    // Request foreground permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        granted: false,
        error: 'Location permission denied',
      };
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      granted: true,
      location,
    };
  } catch (error) {
    return {
      granted: false,
      error: error instanceof Error ? error.message : 'Failed to get location',
    };
  }
};

/**
 * Calculate distance between two coordinates (in km)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calculate estimated delivery time based on distance
 */
export const calculateDeliveryTime = (distanceKm: number): number => {
  // Assume 20 km/h average speed + 10 min preparation time
  const travelTimeMinutes = (distanceKm / 20) * 60;
  const preparationTime = 10;
  return Math.ceil(travelTimeMinutes + preparationTime);
};
