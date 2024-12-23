import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import activityReducer from './activitySlice';
import chatReducer from './chatSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    activity: activityReducer,
    chat: chatReducer,
  },
});
