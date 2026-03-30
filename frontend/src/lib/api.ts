import { Feature, CreateFeatureInput, VoteResponse, AuthUser } from '@/types';
import { getToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Standard Authorization header — works with CORS defaults and swaps
      // cleanly to JWT later: just change 'Token' to 'Bearer'.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      apiFetch<{ access: string; refresh: string }>('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    me: () => apiFetch<AuthUser>('/api/auth/me/'),
  },
  features: {
    list: () => apiFetch<Feature[]>('/api/features/'),
    get: (id: number) => apiFetch<Feature>(`/api/features/${id}/`),
    create: (data: CreateFeatureInput) =>
      apiFetch<Feature>('/api/features/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  votes: {
    toggle: (featureId: number) =>
      apiFetch<VoteResponse>(`/api/features/${featureId}/vote/`, {
        method: 'POST',
      }),
  },
};
