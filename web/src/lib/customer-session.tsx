import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, getCachedCustomerUser, getCustomerToken, setCachedCustomerUser, setCustomerToken, type CustomerUser } from "@/lib/api-client";

type CustomerSession = { user: CustomerUser | null; loading: boolean; login: (email: string, password: string) => Promise<void>; signup: (name: string, email: string, password: string) => Promise<void>; logout: () => void };
const CustomerSessionContext = createContext<CustomerSession | null>(null);

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(() => getCachedCustomerUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCustomerToken();
    if (!token) { setLoading(false); return; }
    api.customerAuth.me(token).then(({ user }) => { setUser(user); setCachedCustomerUser(user); }).catch(() => { setUser(null); setCustomerToken(null); setCachedCustomerUser(null); }).finally(() => setLoading(false));
  }, []);

  const save = (result: { token: string; user: CustomerUser }) => { setCustomerToken(result.token); setCachedCustomerUser(result.user); setUser(result.user); };
  const value = useMemo<CustomerSession>(() => ({
    user, loading,
    login: async (email, password) => save(await api.customerAuth.login(email, password)),
    signup: async (name, email, password) => save(await api.customerAuth.signup(name, email, password)),
    logout: () => { setCustomerToken(null); setCachedCustomerUser(null); setUser(null); },
  }), [user, loading]);
  return <CustomerSessionContext.Provider value={value}>{children}</CustomerSessionContext.Provider>;
}

export function useCustomerSession() {
  const value = useContext(CustomerSessionContext);
  if (!value) throw new Error("useCustomerSession must be used inside CustomerSessionProvider");
  return value;
}
