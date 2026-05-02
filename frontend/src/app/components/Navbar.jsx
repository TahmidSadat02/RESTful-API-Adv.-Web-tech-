"use client";
import Link from 'next/link';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  // Grab token and logout function directly from our Context!
  const { token, logout } = useContext(AppContext);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navBrand}>Coffee Shop Admin</div>
      <div style={styles.navLinks}>
        {/* In Next.js, we use href instead of to */}
        <Link href="/" style={styles.link}>Menu</Link>
        
        {token ? (
          <button onClick={logout} style={styles.logoutButton}>Logout</button>
        ) : (
          <Link href="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea' },
  navBrand: { fontSize: '1.5rem', fontWeight: '700', color: '#100f0f' },
  navLinks: { display: 'flex', gap: '24px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#666666', fontWeight: '500', fontSize: '1rem' },
  logoutButton: { background: 'none', border: 'none', color: '#991b1b', fontWeight: '500', fontSize: '1rem', cursor: 'pointer', padding: 0 }
};