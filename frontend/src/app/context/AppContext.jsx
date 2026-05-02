
"use client"; // Required in Next.js for Context and Hooks
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios'; // This imports your custom Axios bridge!

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(''); 
  const router = useRouter();

  // Initialize auth state safely on the client when the app loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('accessToken'));
    }
  }, []);

  // Lab 03 Task 4: Auto-dismissing notification helper
  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Reusable fetch using Axios (Points to /menu based on your Swagger JSON)
  const fetchMenu = async () => {
    setLoading(true);
    try {
      // Axios automatically parses the JSON and handles the URL!
      const response = await api.get('/menu'); 
      setMenuItems(response.data); // Data is instantly available
    } catch (error) {
      console.error('Error fetching menu:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Centralized Auth Handlers
  const login = (newToken) => {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    triggerNotification("Successfully logged in!");
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    triggerNotification("Logged out successfully.");
    router.push('/login');
  };

  return (
    <AppContext.Provider value={{
      menuItems, loading, fetchMenu, 
      token, login, logout, 
      notification, triggerNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}