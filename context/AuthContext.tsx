"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAuth, setAuth, clearAuth, isValidEmail } from "@/lib/api";

type AuthState = { email: string } | null;

interface AuthContextValue {
  user: AuthState;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthState>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getAuth().then(({ user: u }) => {
      setUser(u);
      setIsReady(true);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const trimmed = email.trim();
    if (!trimmed) return { error: "Please enter your email." };
    if (!isValidEmail(trimmed)) return { error: "Please enter a valid email address." };
    if (!password || password.length < 6) return { error: "Password must be at least 6 characters." };
    await setAuth(trimmed);
    setUser({ email: trimmed });
    return {};
  }, []);

  const signOut = useCallback(() => {
    clearAuth().then(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isReady, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
