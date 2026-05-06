import { Order } from '@/types/order.types';

/**
 * Format date for order display
 */
export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status color based on order status
 */
export const getOrderStatusColor = (status: Order['status']): string => {
  if (!status) {
    return '#6B7280';
  }
  
  switch (status) {
    case 'delivered':
      return '#22C55E';
    case 'cancelled':
      return '#EF4444';
    case 'pending':
      return '#F59E0B';
    case 'preparing':
      return '#3B82F6';
    case 'out_for_delivery':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

/**
 * Get status text based on order status
 */
export const getOrderStatusText = (status: Order['status']): string => {
  if (!status) {
    return 'Unknown';
  }
  
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    case 'pending':
      return 'Pending';
    case 'preparing':
      return 'Preparing';
    case 'out_for_delivery':
      return 'Out for Delivery';
    default:
      return status;
  }
};

/**
 * Filter orders by search query (restaurant or dish name)
 */
export const filterOrdersByQuery = (orders: Order[], query: string): Order[] => {
  if (!query.trim()) {
    return orders;
  }

  const lowerQuery = query.toLowerCase();
  return orders.filter((order) =>
    order.items.some((item) => item.name && item.name.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Sort orders by date (newest first)
 */
export const sortOrdersByDate = (orders: Order[]): Order[] => {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Filter completed orders (delivered or cancelled)
 */
export const getCompletedOrders = (orders: Order[]): Order[] => {
  return orders.filter(
    (order) => order.status === 'delivered' || order.status === 'cancelled'
  );
};
