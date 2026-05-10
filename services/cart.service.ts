import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Cart } from '@/types/cart.types';
import { githubService } from './github.service';

class CartService {
  private readonly CART_FILE = API_ENDPOINTS.FILES.CART;

  async getCart(userId: string): Promise<Cart | null> {
    try {
      const response = await githubService.getFile(this.CART_FILE);
      const carts: Cart[] = response || [];
      
      const userCart = carts.find(cart => cart.userId === userId) || null;
      return userCart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }

  async updateCart(cart: Cart): Promise<Cart> {
    try {
      const response = await githubService.getFile(this.CART_FILE);
      const carts: Cart[] = response || [];
      
      const existingCartIndex = carts.findIndex(c => c.userId === cart.userId);
      
      if (existingCartIndex >= 0) {
        carts[existingCartIndex] = cart;
      } else {
        carts.push(cart);
      }

      await githubService.updateFile(this.CART_FILE, carts, `Update cart for user ${cart.userId}`);
      return cart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const response = await githubService.getFile(this.CART_FILE);
      const carts: Cart[] = response || [];
      
      const filteredCarts = carts.filter(cart => cart.userId !== userId);
      
      await githubService.updateFile(
        this.CART_FILE, 
        filteredCarts, 
        `Clear cart for user ${userId}`
      );
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();