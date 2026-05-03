"use client";
import { useState, useContext } from 'react';
import Link from 'next/link'; // 1. Import the Next.js Link component
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';
import styles from './page.module.css';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.accessToken || response.data.access_token
      
      if (response.data.accessToken) {
        login(response.data.accessToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to manage your coffee shop menu.</p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
          >
            Login to Dashboard
          </button>
        </form>

        {/* 2. Add the navigation link below the form */}
        <div className={styles.backLinkContainer}>
          <Link href="/" className={styles.backLink}>
            ← Back to Menu
          </Link>
        </div>

      </div>
    </section>
  );
}