import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { clearToken, getToken, setToken } from '@/lib/storage';
import type { LoginResponse, User } from '@/types/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (payload: LoginResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setAuthToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const currentUser = await api.me(token);
        if (active) {
          setUser(currentUser);
        }
      } catch {
        clearToken();
        if (active) {
          setAuthToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      ready,
      login(payload) {
        setToken(payload.token);
        setAuthToken(payload.token);
        setUser({
          id: payload.id,
          name: payload.name,
          email: payload.email,
        });
      },
      logout() {
        clearToken();
        setAuthToken(null);
        setUser(null);
      },
      async refreshUser() {
        if (!token) {
          return;
        }
        const currentUser = await api.me(token);
        setUser(currentUser);
      },
    }),
    [ready, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return value;
}
