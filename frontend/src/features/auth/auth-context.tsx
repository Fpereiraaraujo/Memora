import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import {
  clearSession,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/lib/storage';
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
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!token) {
        if (active) {
          setUser(null);
          setReady(true);
        }
        return;
      }

      const cachedUser = getStoredUser();

      if (cachedUser && active) {
        setUser(cachedUser);
        setReady(true);
      }

      try {
        const currentUser = await api.me(token);
        if (active) {
          setUser(currentUser);
          setStoredUser(currentUser);
          setReady(true);
        }
      } catch {
        // Mantém a sessão local quando a API /me falhar por instabilidade de ambiente.
        // O logout real ainda acontece manualmente, e as chamadas autenticadas continuam protegidas.
        if (active) {
          if (!cachedUser) {
            clearSession();
            setAuthToken(null);
            setUser(null);
          }
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
        const loggedUser = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
        };

        setToken(payload.token);
        setStoredUser(loggedUser);
        setAuthToken(payload.token);
        setUser(loggedUser);
      },
      logout() {
        clearSession();
        setAuthToken(null);
        setUser(null);
      },
      async refreshUser() {
        if (!token) {
          return;
        }
        const currentUser = await api.me(token);
        setUser(currentUser);
        setStoredUser(currentUser);
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
