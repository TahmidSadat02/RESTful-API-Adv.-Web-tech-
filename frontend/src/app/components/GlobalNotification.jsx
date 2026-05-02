"use client";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function GlobalNotification() {
  const { notification } = useContext(AppContext);

  if (!notification) return null;

  return (
    <div style={{
      backgroundColor: '#10b981', // Professional green
      color: 'white',
      textAlign: 'center',
      padding: '12px',
      fontWeight: 'bold',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {notification}
    </div>
  );
}