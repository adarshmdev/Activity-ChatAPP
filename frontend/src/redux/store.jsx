import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import activityReducer from './activitySlice';
import chatReducer from './chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activity: activityReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['socket/connect', 'socket/disconnect'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.socket', 'payload.file'],
        // Ignore these paths in the state
        ignoredPaths: ['socket'],
      },
    }),
});

export default store;