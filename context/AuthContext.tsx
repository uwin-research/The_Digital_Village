"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  /**
   * THIS IS THE FIX: ProtectedRoute.tsx expects a property called
   * `isReady` (true once we've finished checking whether a session is
   * already signed in). The previous version of this file called it
   * `loading` instead, which meant ProtectedRoute never saw `isReady`
   * become true, and the "Loading…" screen never went away.
   */
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  createAccount: (email: string, password: string, confirmPassword: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (!cancelled) setUser(data?.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data?.error || "Could not sign in." };
    setUser(data.user);
    return {};
  }, []);

  const createAccount = useCallback(async (email: string, password: string, confirmPassword: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data?.error || "Could not create account." };
    setUser(data.user);
    return {};
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    void fetch("/api/auth", { method: "DELETE" });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isReady, signIn, createAccount, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
