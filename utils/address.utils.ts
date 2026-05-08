import { AddressFormData } from '@/types/address.types';
import * as Location from 'expo-location';

interface GeocodedAddress {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  name?: string;
  district?: string;
  subregion?: string;
}

/**
 * Get address from current location using reverse geocoding
 */
export const getAddressFromLocation = async (
  latitude: number,
  longitude: number,
  addressCount: number
): Promise<AddressFormData> => {
  console.log('📍 Current location:', { latitude, longitude });

  // Get address details using reverse geocoding
  let geocodedAddress: GeocodedAddress | null = null;
  try {
    console.log('🔍 Starting reverse geocoding...');
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (results && results.length > 0) {
      const result = results[0];
      geocodedAddress = {
        street: result.street || result.name,
        city: result.city || result.district || result.subregion,
        region: result.region,
        postalCode: result.postalCode,
        country: result.country,
        name: result.name,
        district: result.district,
        subregion: result.subregion,
      };
      console.log('✅ Reverse geocoding result:', geocodedAddress);
    }
  } catch (geocodeError) {
    console.error('❌ Reverse geocoding failed:', geocodeError);
  }

  let addressData: AddressFormData;

  if (geocodedAddress && (geocodedAddress.street || geocodedAddress.city)) {
    // Use geocoded address details
    const street = geocodedAddress.street || geocodedAddress.name || '';
    const city = geocodedAddress.city || 'City';
    const state = geocodedAddress.region || 'State';
    const postalCode = geocodedAddress.postalCode || '000000';

    addressData = {
      type: 'home' as const,
      label: addressCount === 0 ? 'Home' : `Address ${addressCount + 1}`,
      addressLine1: street || `${city}, ${state}`,
      addressLine2: geocodedAddress.district || undefined,
      city: city,
      state: state,
      pincode: postalCode,
      latitude,
      longitude,
      isDefault: addressCount === 0, // First address is default
    };
    console.log('✅ Using geocoded address:', addressData);
  } else {
    // Fallback if geocoding fails
    addressData = {
      type: 'home' as const,
      label: addressCount === 0 ? 'Home' : `Address ${addressCount + 1}`,
      addressLine1: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      city: 'Current Location',
      state: 'State',
      pincode: '000000',
      latitude,
      longitude,
      isDefault: addressCount === 0,
    };
    console.log('⚠️ Using fallback address (geocoding failed):', addressData);
  }

  return addressData;
};
