"use client";
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; 

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const router = useRouter();

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  useEffect(() => {
    const storedToken =
      localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('accessToken', newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUserRole(decoded.role); 
    } catch (e) {
      console.error("Failed to decode token on login");
    }
    triggerNotification("Successfully logged in!");
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    triggerNotification("Logged out successfully");
    router.push('/');
  };

  return (
    <AppContext.Provider value={{ 
      token, 
      userRole, 
      login, 
      logout, 
      menuItems, 
      loading, 
      fetchMenu, 
      notification, 
      triggerNotification 
    }}>
      {children}
    </AppContext.Provider>
  );
};
