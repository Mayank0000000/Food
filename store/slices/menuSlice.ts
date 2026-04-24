import { menuService } from '@/services/menu.service';
import { MenuItem } from '@/types/menu.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async (_, { rejectWithValue }) => {
    try {
      const items = await menuService.getMenu();
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menu');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = menuSlice.actions;
export default menuSlice.reducer;
