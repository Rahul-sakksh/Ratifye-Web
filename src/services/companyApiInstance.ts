import axios from 'axios';

// Axios instance for local company API
const companyApiInstance = axios.create({
  baseURL: 'https://api.tnt.sakksh.com',
  // baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle logout
const handleLogout = () => {
  localStorage.removeItem('userSession');
};

// Function to show login popup
const showLoginPopup = () => {
  const event = new CustomEvent('showLoginPopup');
  window.dispatchEvent(event);
};

companyApiInstance.interceptors.request.use(
  config => {
    // Add token to every request if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

companyApiInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle 401 Unauthorized error
    if (error.response?.status === 401) {
      console.log('401 Error: Unauthorized, clearing auth data...');
      
      // First clear all auth data
      handleLogout();
      
      // Then trigger login popup
      showLoginPopup();
    }

    // Enhanced error handling
    const enhancedError = {
      ...error,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    
    return Promise.reject(enhancedError);
  }
);

export default companyApiInstance;
