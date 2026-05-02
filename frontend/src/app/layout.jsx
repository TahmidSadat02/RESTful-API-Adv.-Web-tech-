import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import GlobalNotification from './components/GlobalNotification';
import './globals.css';

export const metadata = {
  title: 'Coffee Shop Admin',
  description: 'Manage our coffee menu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {/* The AppProvider wraps the whole app, giving every page access to data */}
        <AppProvider>
          <GlobalNotification /> 
          <Navbar />
          <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}