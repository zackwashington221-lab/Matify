import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, User } from "../api/client";

type AuthValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (await getToken()) setUser(await api.me());
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => setUser(await api.login(email, password)),
      signUp: async (name, email, password) => setUser(await api.register(name, email, password)),
      signOut: async () => {
        await api.logout();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
