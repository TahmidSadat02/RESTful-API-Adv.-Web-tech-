import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Menu from './Menu';
import Login from './Login';

export default function App() {
  const navigate = useNavigate();
  // We use location to force the navbar to re-evaluate when the URL changes (like after logging in)
  const location = useLocation(); 
  
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    // 1. Destroy the token
    localStorage.removeItem('accessToken');
    // 2. Redirect to the home page
    navigate('/');
  };

  return (
    <div style={styles.appContainer}>
      {/* Dynamic Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>Coffee Shop</div>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Menu</Link>
          
          {token ? (
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
        </div>
      </nav>

      {/* Page Routing */}
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #eaeaea',
  },
  navBrand: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#666666',
    fontWeight: '500',
    fontSize: '1rem',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#991b1b', // A subtle red to indicate a destructive action
    fontWeight: '500',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: 0,
  },
  mainContent: {
    padding: '40px 20px',
  }
};