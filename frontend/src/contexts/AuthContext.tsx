"use client";

import { createContext, useContext, useMemo } from "react";
import type { AuthResponse } from "@/types/api";

interface AuthContextValue {
  user: AuthResponse | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: AuthResponse | null;
  children: React.ReactNode;
}) {
  const value = useMemo<AuthContextValue>(() => ({ user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
