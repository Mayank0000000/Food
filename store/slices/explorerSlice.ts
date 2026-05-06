import { FilterState } from '@/types/components/filter-chips.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExplorerState {
  pendingFilters: FilterState | null;
  pendingCategory: string | null;
  pendingSearchQuery: string | null;
}

const initialState: ExplorerState = {
  pendingFilters: null,
  pendingCategory: null,
  pendingSearchQuery: null,
};

const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    setPendingFilters: (state, action: PayloadAction<FilterState>) => {
      state.pendingFilters = action.payload;
    },
    setPendingCategory: (state, action: PayloadAction<string>) => {
      state.pendingCategory = action.payload;
    },
    setPendingSearchQuery: (state, action: PayloadAction<string>) => {
      state.pendingSearchQuery = action.payload;
    },
    clearPendingFilters: (state) => {
      state.pendingFilters = null;
      state.pendingCategory = null;
      state.pendingSearchQuery = null;
    },
  },
});

export const {
  setPendingFilters,
  setPendingCategory,
  setPendingSearchQuery,
  clearPendingFilters,
} = explorerSlice.actions;

export default explorerSlice.reducer;
