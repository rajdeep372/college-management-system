'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // This effect runs on initial load to check for an existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        setUser(decodedUser.user);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('token'); // Clear invalid token
      }
    }
    setLoading(false);
  }, []);

  // --- THIS IS THE UPDATED, MORE RELIABLE LOGIN FUNCTION ---
  const login = (newToken) => {
    const decodedUser = jwtDecode(newToken);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(decodedUser.user);

    // Perform the redirect IMMEDIATELY after setting state
    if (decodedUser.user.role === 'teacher') {
      router.push('/dashboard');
    } else if (decodedUser.user.role === 'student') {
      router.push('/student-dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const authValue = { token, user, login, logout, isAuthenticated: !!token };

  // The loading state prevents rendering children until we know if the user is logged in
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }}>Loading Application...</p>;
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};