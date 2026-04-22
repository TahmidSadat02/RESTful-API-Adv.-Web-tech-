import { useState, useEffect } from 'react';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the public menu route we created earlier
    fetch('http://localhost:3000/menu')
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching menu:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading menu...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Our Menu</h2>
      <div style={styles.grid}>
        {menuItems.map((item) => (
          <div key={item.id} style={styles.card}>
            <h3 style={styles.title}>{item.name}</h3>
            <p style={styles.description}>{item.description}</p>
            <p style={styles.price}>${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimal, clean styling
const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1a1a1a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.25rem',
    color: '#1a1a1a',
  },
  description: {
    margin: '0 0 16px 0',
    color: '#666666',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  price: {
    margin: '0',
    fontWeight: '600',
    fontSize: '1.1rem',
    color: '#1a1a1a',
  },
};