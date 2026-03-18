/**
 * Store Authentication Hook
 * Handles JWT token storage in localStorage and auth state
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

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
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    store: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    const storeData = localStorage.getItem(STORE_KEY);
    
    if (token && storeData) {
      try {
        const store = JSON.parse(storeData) as StoreUser;
        setAuthState({ token, store, isLoading: false, isAuthenticated: true });
      } catch {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(STORE_KEY);
        setAuthState({ token: null, store: null, isLoading: false, isAuthenticated: false });
      }
    } else {
      setAuthState({ token: null, store: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

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

  /**
   * Make an authenticated API call
   */
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
