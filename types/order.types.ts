export interface Location {
  latitude: number;
  longitude: number;
}

export interface OrderLocation {
  restaurant: Location;
  delivery: Location;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'online';

export interface Order {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryLocation: Location;
  restaurantLocation: Location;
  createdAt: string;
  estimatedDeliveryTime: string;
}
