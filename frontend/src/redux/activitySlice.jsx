import { createSlice } from '@reduxjs/toolkit';
import API from '../api';

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    activities: [],
    error: null,
  },
  reducers: {
    setActivities(state, action) {
      state.activities = action.payload;
    },
    addActivity(state, action) {
      state.activities.push(action.payload);
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setActivities, addActivity, setError } = activitySlice.actions;

export const fetchActivities = () => async (dispatch) => {
  try {
    const { data } = await API.get('/activities');
    dispatch(setActivities(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch activities'));
  }
};

export const createActivity = (activityData) => async (dispatch) => {
  try {
    const { data } = await API.post('/activities', activityData);
    dispatch(addActivity(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to create activity'));
  }
};

export default activitySlice.reducer;
