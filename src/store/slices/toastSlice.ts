// src/store/slices/toastSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ToastState {
  loginSuccessToast: boolean;
  registerSuccessToast: boolean;
}

const initialState: ToastState = {
  loginSuccessToast: false,
  registerSuccessToast: false,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setLoginSuccessToast: (state, action) => {
      state.loginSuccessToast = action.payload;
    },
    setRegisterSuccessToast: (state, action) => {
      state.registerSuccessToast = action.payload;
    },
  },
});

// Export actions
export const { setLoginSuccessToast, setRegisterSuccessToast } = toastSlice.actions;

// Export selectors
export const selectLoginSuccessToast = (state: RootState) => state.toast.loginSuccessToast;
export const selectRegisterSuccessToast = (state: RootState) => state.toast.registerSuccessToast;

// Export reducer
export default toastSlice.reducer;