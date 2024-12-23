
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ActivityList from './components/Activity/ActivityList';
import ActivityForm from './components/Activity/ActivityForm';
import ChatRoom from './components/Chat/ChatRoom';
import Navigation from './components/common/Navigation';
import { checkAuthStatus } from './store/slices/authSlice';

const App = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/activities" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/activities" />}
          />
          <Route
            path="/activities"
            element={user ? <ActivityList /> : <Navigate to="/login" />}
          />
          <Route
            path="/activities/new"
            element={user ? <ActivityForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={user ? <ChatRoom /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/activities" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;