import { getOrderById, getUserOrders } from '@/services/order.service';
import { Order } from '@/types/order.types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  activeOrders: Order[]; // Changed from single to array
  orderHistory: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  activeOrders: [], // Changed from null to empty array
  orderHistory: [],
  isLoading: false,
  error: null,
};

/**
 * Fetch all active orders (status = 'ordered')
 */
export const fetchActiveOrders = createAsyncThunk(
  'order/fetchActiveOrders',
  async (userId: string) => {
    const orders = await getUserOrders(userId);
    // Find all orders with status 'ordered', sorted by creation date (newest first)
    const activeOrders = orders
      .filter(order => order.status === 'ordered')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return activeOrders;
  }
);

/**
 * Fetch order by ID
 */
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string) => {
    return await getOrderById(orderId);
  }
);

/**
 * Fetch user order history
 */
export const fetchOrderHistory = createAsyncThunk(
  'order/fetchOrderHistory',
  async (userId: string) => {
    const orders = await getUserOrders(userId);
    // Sort by creation date, newest first
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addActiveOrder: (state, action: PayloadAction<Order>) => {
      // Add new order to the beginning of the array
      state.activeOrders = [action.payload, ...state.activeOrders];
    },
    removeActiveOrder: (state, action: PayloadAction<string>) => {
      // Remove order by ID
      state.activeOrders = state.activeOrders.filter(order => order.id !== action.payload);
    },
    clearActiveOrders: (state) => {
      state.activeOrders = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active orders
      .addCase(fetchActiveOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeOrders = action.payload;
      })
      .addCase(fetchActiveOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch active orders';
      })
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.status === 'ordered') {
          // Add to active orders if not already present
          const exists = state.activeOrders.some(order => order.id === action.payload.id);
          if (!exists) {
            state.activeOrders = [action.payload, ...state.activeOrders];
          }
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order';
      })
      // Fetch order history
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order history';
      });
  },
});

export const { addActiveOrder, removeActiveOrder, clearActiveOrders, clearError } = orderSlice.actions;
export default orderSlice.reducer;
