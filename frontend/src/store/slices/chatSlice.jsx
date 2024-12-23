

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat", {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        messageData,
        {
          withCredentials: true
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    error: null,
    loading: false,
  },
  reducers: {
    addMessage: (state, action) => {
      // Normalize message structure
      const normalizedMessage = {
        ...action.payload,
        message_text: action.payload.message_text || action.payload.text,
        user_name: action.payload.user_name || action.payload.userName,
      };
      state.messages.push(normalizedMessage);
    },
    setMessages: (state, action) => {
      // Normalize entire messages array
      state.messages = action.payload.map((msg) => ({
        ...msg,
        message_text: msg.message_text || msg.text,
        user_name: msg.user_name || msg.userName,
      }));
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch messages";
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to send message";
      });
  },
});

export const { addMessage, setMessages, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;