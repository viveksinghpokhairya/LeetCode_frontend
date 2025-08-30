import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slicers/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

