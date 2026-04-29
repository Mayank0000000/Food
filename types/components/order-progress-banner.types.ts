import { Order } from '@/types/order.types';

export interface OrderProgressBannerProps {
  order: Order;
  onTrackOrder: () => void;
}
