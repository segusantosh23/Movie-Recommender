
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  updateUser: (newUsername: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cinesuggest_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('cinesuggest_user');
    }
  }, []);

  const login = (username: string) => {
    const newUser: User = { username };
    setUser(newUser);
    localStorage.setItem('cinesuggest_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinesuggest_user');
  };

  const updateUser = (newUsername: string) => {
    if (user) {
      const updatedUser = { ...user, username: newUsername };
      setUser(updatedUser);
      localStorage.setItem('cinesuggest_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};