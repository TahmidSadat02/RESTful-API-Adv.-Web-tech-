"use client";
import { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import AddMenuItem from './components/AddMenuItem';

export default function MenuPage() {
  // Grab the data and functions from our Global Warehouse
  const { menuItems, loading, fetchMenu, token } = useContext(AppContext);

  // Fetch the menu from the database as soon as the page loads
  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Our Menu</h2>

      {/* Security Gate: Only show the form if the user is logged in */}
      {token && <AddMenuItem onAddSuccess={fetchMenu} />}

      {loading ? (
        <div style={styles.loading}>Loading freshly brewed menu...</div>
      ) : menuItems.length === 0 ? (
        <div style={styles.empty}>No items found in the database.</div>
      ) : (
        <div style={styles.grid}>
          {menuItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3 style={styles.title}>{item.name}</h3>
              {item.description && <p style={styles.description}>{item.description}</p>}
              <p style={styles.price}>${Number(item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px 0', fontFamily: 'system-ui, sans-serif' },
  header: { fontSize: '2.5rem', fontWeight: '700', marginBottom: '30px', color: '#1a1a1a' },
  loading: { fontSize: '1.2rem', color: '#666', textAlign: 'center', padding: '40px' },
  empty: { fontSize: '1.2rem', color: '#666', textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  card: { border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'transform 0.2s ease', cursor: 'pointer' },
  title: { margin: '0 0 12px 0', fontSize: '1.4rem', color: '#1a1a1a', fontWeight: '600' },
  description: { margin: '0 0 20px 0', color: '#666666', fontSize: '0.95rem', lineHeight: '1.5' },
  price: { margin: '0', fontWeight: '700', fontSize: '1.25rem', color: '#10b981' },
};