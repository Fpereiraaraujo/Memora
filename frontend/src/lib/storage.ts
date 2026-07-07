import type { User } from '@/types/auth';

const TOKEN_KEY = 'memora.token';
const USER_KEY = 'memora.user';

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  try {
    const value = window.localStorage.getItem(USER_KEY);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value) as Partial<User>;

    if (!parsed.id || !parsed.email || !parsed.name) {
      return null;
    }

    return {
      id: String(parsed.id),
      name: String(parsed.name),
      email: String(parsed.email),
    };
  } catch {
    return null;
  }
}

export function setStoredUser(user: User) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  window.localStorage.removeItem(USER_KEY);
}

export function clearSession() {
  clearToken();
  clearStoredUser();
}
