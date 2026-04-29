import { OrderTrackingData } from '@/utils/orderSimulation';

export interface OrderStatusSectionProps {
  trackingData: OrderTrackingData | null;
  distance: number;
  onCancelOrder: () => void;
  onBackToHome: () => void;
}
