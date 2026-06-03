import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import settingsReducer from './settingsSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }),
});

export default store;
