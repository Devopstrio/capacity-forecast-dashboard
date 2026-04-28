import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice';
import capacityReducer from './store/slices/capacitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    capacity: capacityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
