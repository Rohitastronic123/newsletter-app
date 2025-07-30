import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/profile');
      setUser(data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, role });
    
    if (role === 'premium' && data.clientSecret) {
      return { requiresPayment: true, clientSecret: data.clientSecret };
    }
    
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser({ ...data.user, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

const upgradeToPremium = async () => {
  try {
    const { data } = await axios.post('/api/user/upgrade');
    // Do not set user role yet — wait until payment succeeds
    return data;
  } catch (err) {
    console.error("Failed to initiate renewal:", err.response?.data || err.message);
    throw new Error("Failed to initiate renewal");
  }
};

  const renewPremium = async () => {
    const { data } = await axios.post('/api/user/renew');
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, upgradeToPremium, renewPremium }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);