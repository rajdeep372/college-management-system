import { AuthProvider } from '../context/AuthContext'; // Import the provider
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import './globals.css';

export const metadata = {
  title: 'School Management System',
  description: 'A modern system for managing students, attendance, and routines.',
};

export default function RootLayout({ children }) {
  const mainContentStyle = {
    flexGrow: 1,
    padding: '2rem',
    marginLeft: '250px',
    height: 'calc(100vh - 60px)',
    overflowY: 'auto',
  };

  const bodyContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };
  
  const contentWrapperStyle = {
      display: 'flex',
      flex: 1,
  };

  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* Wrap everything with the AuthProvider */}
          <div style={bodyContainerStyle}>
              <div style={contentWrapperStyle}>
                  <Sidebar />
                  <main style={mainContentStyle}>
                      {children}
                  </main>
              </div>
              <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}