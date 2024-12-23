import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import activityReducer from './slices/activitySlice';
import chatReducer from './slices/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activity: activityReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'socket/connect', 
          'socket/disconnect',
          'activity/createActivity/pending'
        ],
        ignoredActionPaths: [
          'payload.socket', 
          'payload.file',
          'meta.arg',
          'payload.images'
        ],
        ignoredPaths: ['socket'],
      },
    }),
});

export default store;