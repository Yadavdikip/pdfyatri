import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signin = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo purposes, accept any email/password
      const mockUser = { email, name: email.split('@')[0] };
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signup = async (email, password, name) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo purposes, accept any signup
      const mockUser = { email, name };
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
