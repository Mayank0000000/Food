export interface Location {
  latitude: number;
  longitude: number;
}

export interface OrderLocation {
  restaurant: Location;
  delivery: Location;
}

export type OrderStatus = 
  | 'ordered'      // Initial status when order is placed
  | 'delivered'    // Final status - successfully delivered
  | 'cancelled';   // Final status - order cancelled

export type TrackingStatus = 
  | 'confirmed'    // Order confirmed (for tracking UI)
  | 'preparing'    // Preparing food (for tracking UI)
  | 'out_for_delivery' // Out for delivery (for tracking UI)
  | 'delivered';   // Delivered

export type PaymentMethod = 'cod' | 'online';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  finalAmount: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryLocation: Location;
  restaurantLocation: Location;
  createdAt: string;
  estimatedDeliveryTime: string;
}
