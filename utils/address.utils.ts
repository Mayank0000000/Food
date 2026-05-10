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

  // Get address details using reverse geocoding
  let geocodedAddress: GeocodedAddress | null = null;
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (results && results.length > 0) {
      const result = results[0];
      geocodedAddress = {
        street: result.street ?? result.name ?? undefined,
        city: result.city ?? result.district ?? result.subregion ?? undefined,
        region: result.region ?? undefined,
        postalCode: result.postalCode ?? undefined,
        country: result.country ?? undefined,
        name: result.name ?? undefined,
        district: result.district ?? undefined,
        subregion: result.subregion ?? undefined,
      };
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
      isDefault: addressCount === 0, // First address is default
    };
  } else {
    // Fallback if geocoding fails
    addressData = {
      type: 'home' as const,
      label: addressCount === 0 ? 'Home' : `Address ${addressCount + 1}`,
      addressLine1: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      city: 'Current Location',
      state: 'State',
      pincode: '000000',
      isDefault: addressCount === 0,
    };
    console.log('⚠️ Using fallback address (geocoding failed):', addressData);
  }

  return addressData;
};
