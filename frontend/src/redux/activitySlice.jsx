import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const fetchActivities = createAsyncThunk(
  'activity/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/activities');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
    }
  }
);

export const createActivity = createAsyncThunk(
  'activity/createActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/activities', activityData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create activity');
    }
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    activities: [],
    error: null,
    loading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
        state.loading = false;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.push(action.payload);
        state.loading = false;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearError } = activitySlice.actions;
export default activitySlice.reducer;