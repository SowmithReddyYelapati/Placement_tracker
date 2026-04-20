import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('placement_user');
    const token = localStorage.getItem('placement_token');
    return (savedUser && token) ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If you need async checks like verifying the token in the future, do it here.
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('placement_user', JSON.stringify(userData));
    localStorage.setItem('placement_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('placement_user');
    localStorage.removeItem('placement_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
