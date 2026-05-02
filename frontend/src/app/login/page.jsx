"use client";
import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function LoginPage() {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Points exactly to your AuthController_login route
      const response = await api.post('/auth/login', { email, password });
      
      // Assuming your backend returns { accessToken: "..." }
      if (response.data.accessToken) {
        login(response.data.accessToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Admin Login</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Login to Dashboard</button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' },
  form: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '24px', color: '#1a1a1a' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  error: { color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }
};