import { createSlice } from '@reduxjs/toolkit';
import API from '../api';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, error: null },
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setAuth, setError } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await API.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    dispatch(setAuth({ user: data.user, token: data.token }));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Login failed'));
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    await API.post('/auth/register', userData);
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Registration failed'));
  }
};

export default authSlice.reducer;
