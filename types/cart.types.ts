import { MenuItem } from './menu.types';

export interface CartItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  updatedAt: string;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}