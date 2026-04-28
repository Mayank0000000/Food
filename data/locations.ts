import { OrderLocation } from '@/types/order.types';

// Hardcoded locations for demo
export const DEMO_LOCATIONS: OrderLocation = {
  // Restaurant location (JP Nagar, Bangalore)
  restaurant: {
    latitude: 12.9082,
    longitude: 77.5855,
  },
  // Delivery location (nearby area)
  delivery: {
    latitude: 12.9165,
    longitude: 77.5920,
  },
};

export const RESTAURANT_NAME = 'Perfect Pairing';
export const RESTAURANT_ADDRESS = 'JP Nagar, Bangalore';
