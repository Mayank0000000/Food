import { OPENROUTE_API_KEY } from '@/config/env';
import { Location } from '@/types/order.types';

interface OpenRouteResponse {
  routes: Array<{
    geometry: string; // Encoded polyline
    summary: {
      distance: number;
      duration: number;
    };
  }>;
  error?: {
    message: string;
  };
}

/**
 * Decode OpenRouteService encoded polyline (same as Google's format)
 */
const decodePolyline = (encoded: string): Location[] => {
  const points: Location[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
};

/**
 * Get directions from OpenRouteService API (FREE)
 */
export const getDirections = async (
  origin: Location,
  destination: Location
): Promise<{ path: Location[]; distance: number; duration: number } | null> => {
  if (!OPENROUTE_API_KEY) {
    console.warn('OpenRouteService API key not configured. Using straight line.');
    return null;
  }

  try {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    
    const body = {
      coordinates: [
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude],
      ],
    };

    console.log('🗺️ Fetching directions from OpenRouteService...');
    console.log('📍 Origin:', origin);
    console.log('📍 Destination:', destination);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': OPENROUTE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data: OpenRouteResponse = await response.json();

    console.log('📦 OpenRouteService Response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('❌ OpenRouteService error:', data.error.message);
      return null;
    }

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const encodedGeometry = route.geometry;
      
      // Decode the polyline
      const path = decodePolyline(encodedGeometry);

      console.log('✅ Got directions path with', path.length, 'points');

      return {
        path,
        distance: route.summary.distance, // in meters
        duration: route.summary.duration, // in seconds
      };
    }

    console.warn('⚠️ No routes found');
    return null;
  } catch (error) {
    console.error('❌ Error fetching directions:', error);
    return null;
  }
};
