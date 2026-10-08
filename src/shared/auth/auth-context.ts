import { createContext, useContext } from "react";
import type { Role, User } from "@/shared/lib/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** No roles passed = any authenticated user is allowed. */
  hasRole: (roles?: readonly Role[]) => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
