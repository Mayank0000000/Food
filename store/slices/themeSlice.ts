import { darkTheme, lightTheme, Theme, ThemeMode } from '@/types/theme.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = '@theme_mode';

interface ThemeState {
  mode: ThemeMode;
  theme: Theme;
}

const initialState: ThemeState = {
  mode: 'light',
  theme: lightTheme,
};

/**
 * Load theme from storage
 */
export const loadTheme = createAsyncThunk('theme/load', async () => {
  try {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return (stored as ThemeMode) || 'light';
  } catch (error) {
    console.error('Failed to load theme:', error);
    return 'light';
  }
});

/**
 * Save theme to storage
 */
export const saveTheme = createAsyncThunk('theme/save', async (mode: ThemeMode) => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    return mode;
  } catch (error) {
    console.error('Failed to save theme:', error);
    throw error;
  }
});

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.theme = action.payload === 'dark' ? darkTheme : lightTheme;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.theme = state.mode === 'dark' ? darkTheme : lightTheme;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
        state.theme = action.payload === 'dark' ? darkTheme : lightTheme;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
        state.theme = action.payload === 'dark' ? darkTheme : lightTheme;
      });
  },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
