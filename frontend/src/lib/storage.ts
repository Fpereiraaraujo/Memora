import type { User } from '@/types/auth';

const TOKEN_KEY = 'memora.token';
const USER_KEY = 'memora.user';
const REFERRAL_KEY = 'memora.referral';
const REFERRAL_TTL_DAYS = 30;

export interface StoredReferral {
  referralCode: string;
  expiresAt: string;
}

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
      role: parsed.role === 'ADMIN' || parsed.role === 'HOST' ? parsed.role : undefined,
      status: parsed.status === 'ACTIVE' || parsed.status === 'SUSPENDED' || parsed.status === 'DELETED'
        ? parsed.status
        : undefined,
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

export function getStoredReferral(): StoredReferral | null {
  try {
    const rawValue = window.localStorage.getItem(REFERRAL_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<StoredReferral>;
    if (!parsed.referralCode || !parsed.expiresAt) {
      window.localStorage.removeItem(REFERRAL_KEY);
      return null;
    }

    const expiresAt = new Date(parsed.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      window.localStorage.removeItem(REFERRAL_KEY);
      return null;
    }

    return {
      referralCode: String(parsed.referralCode),
      expiresAt: expiresAt.toISOString(),
    };
  } catch {
    window.localStorage.removeItem(REFERRAL_KEY);
    return null;
  }
}

export function setStoredReferral(referralCode: string) {
  const normalizedReferralCode = referralCode.trim().toUpperCase();
  if (!normalizedReferralCode) {
    return;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFERRAL_TTL_DAYS);
  const payload: StoredReferral = {
    referralCode: normalizedReferralCode,
    expiresAt: expiresAt.toISOString(),
  };
  window.localStorage.setItem(REFERRAL_KEY, JSON.stringify(payload));
}

export function clearStoredReferral() {
  window.localStorage.removeItem(REFERRAL_KEY);
}
