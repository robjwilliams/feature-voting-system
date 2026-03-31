import { describe, it, expect, beforeEach } from 'vitest';
import { getToken, setAuth, clearAuth } from '@/lib/auth';

const mockUser = { id: 1, username: 'alice' };

beforeEach(() => {
  localStorage.clear();
});

describe('getToken', () => {
  it('returns null when localStorage is empty', () => {
    expect(getToken()).toBeNull();
  });

  it('returns the token after setAuth', () => {
    setAuth('my-token', mockUser);
    expect(getToken()).toBe('my-token');
  });
});

describe('setAuth', () => {
  it('stores the token under the fv-token key', () => {
    setAuth('abc123', mockUser);
    expect(localStorage.getItem('fv-token')).toBe('abc123');
  });
});

describe('clearAuth', () => {
  it('removes the token so getToken returns null', () => {
    setAuth('my-token', mockUser);
    clearAuth();
    expect(getToken()).toBeNull();
  });
});
