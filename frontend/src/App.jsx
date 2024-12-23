import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ActivityList from './components/Activity/ActivityList';
import ActivityForm from './components/Activity/ActivityForm';
import ChatRoom from './components/Chat/ChatRoom';
import Navigation from './components/Navigation';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/activities" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/activities" />} />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivityList />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities/new"
              element={
                <PrivateRoute>
                  <ActivityForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatRoom />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/activities" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;