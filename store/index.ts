import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import chatReducer from './slices/chatSlice';
import explorerReducer from './slices/explorerSlice';
import languageReducer from './slices/languageSlice';
import menuReducer from './slices/menuSlice';
import orderReducer from './slices/orderSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    cart: cartReducer,
    order: orderReducer,
    chat: chatReducer,
    explorer: explorerReducer,
    language: languageReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
