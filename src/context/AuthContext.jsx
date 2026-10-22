import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const TOKEN_KEY = 'freshbite-token';
const USER_KEY = 'freshbite-user';

function readUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authError, setAuthError] = useState('');

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setAuthError('Your session ended. Please sign in again.');
  };
  useEffect(() => {
    const expired = () => logout();
    window.addEventListener('freshbite:session-expired', expired);
    return () => window.removeEventListener('freshbite:session-expired', expired);
  }, []);

  const login = async (username, password) => {
    setAuthError('');
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username: username.trim(), password, expiresInMins: 30,
      }, { headers: { 'Content-Type': 'application/json' } });
      const data = response.data;
      const accessToken = data.accessToken || data.token;
      if (!accessToken) throw new Error('The login API did not return an authentication token.');
      const nextUser = { id: data.id, username: data.username, displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username };
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      setToken(accessToken);
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      const message = error.response?.status === 400 || error.response?.status === 401
        ? 'Login failed. Check your username and password.'
        : error.message || 'Unable to sign in. Check your internet connection and try again.';
      setAuthError(message);
      throw new Error(message);
    }
  };
  return <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user && token), login, logout, authError, clearAuthError: () => setAuthError('') }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
