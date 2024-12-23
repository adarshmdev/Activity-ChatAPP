
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true, 
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// API.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('token'); 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         Cookies.remove('token'); 
//         window.location.href = '/login';
//       }
//       return Promise.reject(error.response.data);
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;
