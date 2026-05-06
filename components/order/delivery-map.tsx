import { useTheme } from '@/hooks/useTheme';
import { deliveryMapStyles } from '@/styles/components/delivery-map.styles';
import { DeliveryMapProps } from '@/types/components/delivery-map.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  restaurant,
  delivery,
  trackingData,
  routePath,
  restaurantName,
  restaurantAddress,
}) => {
  const { colors } = useTheme();
  
  return (
    <MapView
      style={deliveryMapStyles.map}
      initialRegion={{
        latitude: (restaurant.latitude + delivery.latitude) / 2,
        longitude: (restaurant.longitude + delivery.longitude) / 2,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {/* Restaurant Marker */}
      <Marker
        coordinate={restaurant}
        title={restaurantName}
        description={restaurantAddress}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <Ionicons name="restaurant" size={32} color={colors.primary} />
      </Marker>

      {/* Delivery Person Marker (animated) */}
      {trackingData && trackingData.status !== 'delivered' && (
        <Marker
          coordinate={trackingData.currentLocation}
          title="Delivery Person"
          description="On the way to you"
          anchor={{ x: 0.5, y: 0.5 }}
          flat
        >
          <Ionicons name="bicycle" size={32} color="#3B82F6" />
        </Marker>
      )}

      {/* Delivery Location Marker */}
      <Marker
        coordinate={delivery}
        title="Delivery Location"
        description="Your delivery address"
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <Ionicons name="location" size={32} color={colors.success} />
      </Marker>

      {/* Route Path */}
      {routePath.length > 2 && (
        <Polyline
          coordinates={routePath}
          strokeColor={colors.primary}
          strokeWidth={3}
          lineDashPattern={[1]}
        />
      )}
    </MapView>
  );
};
