import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Order } from '@/types/order.types';
import { githubService } from './github.service';

class OrderService {
  private readonly ORDERS_FILE = API_ENDPOINTS.FILES.ORDERS;

  /**
   * Create a new order
   */
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      // Get existing orders
      const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];

      // Generate new order ID
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new order
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        createdAt: new Date().toISOString(),
      };

      // Add to orders array
      orders.push(newOrder);

      // Update orders file
      await githubService.updateFile(
        this.ORDERS_FILE,
        orders,
        `Create order ${orderId}`
      );

      console.log('✅ Order created successfully:', orderId);
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
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
  async updateOrderStatus(
    orderId: string,
    status: 'delivered' | 'cancelled'
  ): Promise<Order | null> {
    try {
      const orders: Order[] = (await githubService.getFile(this.ORDERS_FILE)) || [];

      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      // Update order status to final state
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
      };

      // Save updated orders
      await githubService.updateFile(
        this.ORDERS_FILE,
        orders,
        `Update order ${orderId} status to ${status}`
      );

      console.log(`✅ Order ${orderId} status updated to ${status}`);
      return orders[orderIndex];
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
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

      console.log(`✅ Order ${orderId} deleted`);
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
