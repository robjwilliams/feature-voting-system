import type { AuthUser } from '@/types';
export type { AuthUser };

const TOKEN_KEY = 'fv-token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token: string, _user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
}
