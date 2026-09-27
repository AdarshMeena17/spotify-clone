import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  getErrorMessage,
} from '../services/api';

const AuthContext = createContext(null);

// The backend returns `id` from /register and /login, but `_id` from
// /me (a raw Mongoose doc). Normalize once here so the rest of the
// app can always read `user.id` safely.
function normalizeUser(user) {
  if (!user) return null;
  return { ...user, id: user.id || user._id };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then(({ user: me }) => {
        if (!cancelled) setUser(normalizeUser(me));
      })
      .catch(() => {
        // 401 just means logged out — not an error worth surfacing.
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setUser(normalizeUser(data.user));
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    return registerUser(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Even if the network call fails, clear local state so the UI
      // reflects a logged-out session.
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user: me } = await getCurrentUser();
      setUser(normalizeUser(me));
    } catch (error) {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isArtist: user?.role === 'artist',
      initializing,
      login,
      register,
      logout,
      refreshUser,
      getErrorMessage,
    }),
    [user, initializing, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
