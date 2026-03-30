// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    // Add more reducers here as needed
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;