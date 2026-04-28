import { Location } from '@/types/order.types';
import { OrderTrackingData } from '@/utils/orderSimulation';

export interface DeliveryMapProps {
  restaurant: Location;
  delivery: Location;
  trackingData: OrderTrackingData | null;
  routePath: Location[];
  restaurantName: string;
  restaurantAddress: string;
}
