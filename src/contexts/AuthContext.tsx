import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'manager' | 'builder';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Тестовые аккаунты
const testUsers: Record<string, { password: string; user: User }> = {
  'admin@techpower.ru': {
    password: 'admin123',
    user: {
      id: 1,
      email: 'admin@techpower.ru',
      name: 'Александр Админов',
      role: 'admin'
    }
  },
  'manager@techpower.ru': {
    password: 'manager123',
    user: {
      id: 2,
      email: 'manager@techpower.ru',
      name: 'Мария Менеджер',
      role: 'manager'
    }
  },
  'builder@techpower.ru': {
    password: 'builder123',
    user: {
      id: 3,
      email: 'builder@techpower.ru',
      name: 'Сергей Сборщик',
      role: 'builder'
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем сохраненную сессию
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const userRecord = testUsers[email];
    
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      setIsAuthenticated(true);
      localStorage.setItem('authUser', JSON.stringify(userRecord.user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}