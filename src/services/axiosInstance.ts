import axios from 'axios';

const axiosInstancetandt = axios.create({
  baseURL: 'https://api.tnt.sakksh.com',
  // baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstancetandt.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstancetandt.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    
    const enhancedError = {
      ...error,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    
    return Promise.reject(enhancedError);
  }
);

export default axiosInstancetandt;
