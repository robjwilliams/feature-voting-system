'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, getToken, setAuth, clearAuth } from '@/lib/auth';
import { api } from '@/lib/api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (token) {
      api.auth
        .me()
        .then((u) => setUser(u))
        .catch(() => clearAuth())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(username: string, password: string) {
    const { access } = await api.auth.login(username, password);
    // Store token first so the me() call is authenticated
    setAuth(access, { id: 0, username });
    const me = await api.auth.me();
    setAuth(access, me);
    setUser(me);
  }

  function logout() {
    clearAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
