import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Order } from '@/types/order.types';
import { githubService } from './github.service';

class OrderService {
  private readonly ORDERS_FILE = API_ENDPOINTS.FILES.ORDERS;

  /**
   * Create a new order
   */
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const MAX_RETRIES = 3;
    let lastError: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];
        const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newOrder: Order = { ...orderData, id: orderId, createdAt: new Date().toISOString() };
        orders.push(newOrder);
        await githubService.updateFile(this.ORDERS_FILE, orders, `Create order ${orderId}`);
        return newOrder;
      } catch (error: any) {
        lastError = error;
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
    console.error('Failed to create order:', lastError);
    throw lastError;
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Failed to get order:', error);
      throw error;
    }
  }

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];
      return orders.filter(order => order.userId === userId);
    } catch (error) {
      console.error('Failed to get user orders:', error);
      throw error;
    }
  }

  /**
   * Update order status to final state (delivered or cancelled only)
   */
  async updateOrderStatus(orderId: string, status: 'delivered' | 'cancelled'): Promise<Order | null> {
    const MAX_RETRIES = 3;
    let lastError: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex === -1) throw new Error('Order not found');

        orders[orderIndex] = { ...orders[orderIndex], status };
        await githubService.updateFile(this.ORDERS_FILE, orders, `Update order ${orderId} status to ${status}`);
        return orders[orderIndex];
      } catch (error: any) {
        lastError = error;
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
    console.error('Failed to update order status:', lastError);
    throw lastError;
  }

  /**
   * Cancel order (only allowed if status is 'ordered')
   */
  async cancelOrder(orderId: string): Promise<Order | null> {
    try {
      const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];

      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const order = orders[orderIndex];

      // Check if order can be cancelled (only if status is still 'ordered')
      if (order.status !== 'ordered') {
        throw new Error('Cannot cancel order that has already been delivered or cancelled');
      }

      // Update order status to cancelled
      return await this.updateOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }

  /**
   * Delete order (for testing purposes)
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];
      const filteredOrders = orders.filter(order => order.id !== orderId);

      await githubService.updateFile(
        this.ORDERS_FILE,
        filteredOrders,
        `Delete order ${orderId}`
      );

    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();

// Export individual functions for convenience
export const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) =>
  orderService.createOrder(orderData);
export const getOrderById = (orderId: string) => orderService.getOrderById(orderId);
export const getUserOrders = (userId: string) => orderService.getUserOrders(userId);
export const updateOrderStatus = (orderId: string, status: 'delivered' | 'cancelled') =>
  orderService.updateOrderStatus(orderId, status);
export const cancelOrder = (orderId: string) => orderService.cancelOrder(orderId);
export const deleteOrder = (orderId: string) => orderService.deleteOrder(orderId);
