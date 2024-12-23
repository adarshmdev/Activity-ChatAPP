import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    error: null,
    loading: false,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  setError,
  clearError,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;