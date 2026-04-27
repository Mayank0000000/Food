import { cartService } from '@/services/cart.service';
import { Cart, CartItem, CartState } from '@/types/cart.types';
import { MenuItem } from '@/types/menu.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string) => {
    return await cartService.getCart(userId);
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, userName, menuItem, quantity = 1 }: {
    userId: string;
    userName: string;
    menuItem: MenuItem;
    quantity?: number;
  }) => {
    const existingCart = await cartService.getCart(userId);
    
    const cartItem: CartItem = {
      id: Date.now(),
      menuItem,
      quantity,
      addedAt: new Date().toISOString(),
    };

    let updatedCart: Cart;

    if (existingCart) {
      const existingItemIndex = existingCart.items.findIndex(
        item => item.menuItem.id === menuItem.id
      );

      if (existingItemIndex >= 0) {
        existingCart.items[existingItemIndex].quantity += quantity;
      } else {
        existingCart.items.push(cartItem);
      }

      updatedCart = {
        ...existingCart,
        totalItems: existingCart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: existingCart.items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0),
        updatedAt: new Date().toISOString(),
      };
    } else {
      updatedCart = {
        userId,
        userName,
        items: [cartItem],
        totalItems: quantity,
        totalAmount: menuItem.price * quantity,
        updatedAt: new Date().toISOString(),
      };
    }

    return await cartService.updateCart(updatedCart);
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ userId, itemId, quantity }: {
    userId: string;
    itemId: number;
    quantity: number;
  }) => {
    const existingCart = await cartService.getCart(userId);
    
    if (!existingCart) {
      throw new Error('Cart not found');
    }

    if (quantity <= 0) {
      existingCart.items = existingCart.items.filter(item => item.id !== itemId);
    } else {
      const itemIndex = existingCart.items.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        existingCart.items[itemIndex].quantity = quantity;
      }
    }

    const updatedCart = {
      ...existingCart,
      totalItems: existingCart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: existingCart.items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0),
      updatedAt: new Date().toISOString(),
    };

    return await cartService.updateCart(updatedCart);
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId: string) => {
    await cartService.clearCart(userId);
    return userId;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add to cart';
      })
      // Update cart item quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export default cartSlice.reducer;