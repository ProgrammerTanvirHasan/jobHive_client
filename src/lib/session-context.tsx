"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authClient } from "./auth-client";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
} | null;

type SessionContextValue = {
  user: User;
  setUser: (user: User) => void;
  refreshSession: () => Promise<void>;
  loading: boolean;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  initialUser,
  children,
}: {
  initialUser: User;
  children: ReactNode;
}) {
  const [user, setUserState] = useState<User>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const session = await authClient.getSession();
      const nextUser = session?.data?.user ?? session?.data ?? null;
      setUserState(nextUser);
    } catch {
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setUser = useCallback((value: User) => {
    setUserState(value);
  }, []);

  useEffect(() => {
    if (!initialUser) {
      refreshSession();
    }
  }, [initialUser, refreshSession]);

  const value = useMemo(
    () => ({ user, setUser, refreshSession, loading }),
    [user, setUser, refreshSession, loading],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
