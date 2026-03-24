/**
 * Store Authentication Hook
 * Handles JWT token storage, email/password auth, and Google OAuth hash extraction
 */

'use client';

import { useState, useCallback } from 'react';

const AUTH_KEY = 'anshinsweets_store_token';
const STORE_KEY = 'anshinsweets_store_data';

type StoreUser = {
  id: string;
  email: string;
  store_name: string;
};

type AuthState = {
  token: string | null;
  store: StoreUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useStoreAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const defaultState: AuthState = { token: null, store: null, isLoading: false, isAuthenticated: false };
    if (typeof window === 'undefined') return { ...defaultState, isLoading: true };

    // Check URL hash for Google OAuth token (redirect from /api/auth/callback)
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const hashToken = params.get('token');
      const hashStore = params.get('store');

      if (hashToken && hashStore) {
        try {
          const storeData = JSON.parse(decodeURIComponent(hashStore)) as StoreUser;
          localStorage.setItem(AUTH_KEY, hashToken);
          localStorage.setItem(STORE_KEY, JSON.stringify(storeData));
          // Clean URL hash
          window.history.replaceState(null, '', window.location.pathname);
          return { token: hashToken, store: storeData, isLoading: false, isAuthenticated: true };
        } catch {
          // ignore parse errors
        }
      }
    }

    // Load from localStorage
    const token = localStorage.getItem(AUTH_KEY);
    const storeDataStr = localStorage.getItem(STORE_KEY);

    if (token && storeDataStr) {
      try {
        const store = JSON.parse(storeDataStr) as StoreUser;
        return { token, store, isLoading: false, isAuthenticated: true };
      } catch {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(STORE_KEY);
      }
    }
    return defaultState;
  });

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'ログインに失敗しました' };

      localStorage.setItem(AUTH_KEY, data.token);
      localStorage.setItem(STORE_KEY, JSON.stringify(data.store));
      setAuthState({
        token: data.token,
        store: data.store,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'ネットワークエラーが発生しました' };
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    storeName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, store_name: storeName }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || '登録に失敗しました' };

      localStorage.setItem(AUTH_KEY, data.token);
      localStorage.setItem(STORE_KEY, JSON.stringify(data.store));
      setAuthState({
        token: data.token,
        store: data.store,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'ネットワークエラーが発生しました' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(STORE_KEY);
    setAuthState({ token: null, store: null, isLoading: false, isAuthenticated: false });
  }, []);

  /** Make an authenticated API call */
  const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem(AUTH_KEY);
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    authFetch,
  };
}
