// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../../store/slices/authSlice';

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { error, loading } = useSelector((state) => state.auth);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await dispatch(login(formData)).unwrap();
//       navigate('/activities');
//     } catch (err) {
//       console.error('Login failed:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6">Login</h1>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="block w-full p-2 border rounded focus:outline-none focus:border-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="block w-full p-2 border rounded focus:outline-none focus:border-blue-500"
//             required
//             minLength={6}
//           />
//         </div>
//         <button
//           className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
//           type="submit"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/activities');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h1>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 placeholder-gray-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 placeholder-gray-400"
              required
              minLength={6}
            />
          </div>
          <button
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <a href="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
