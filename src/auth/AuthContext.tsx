import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  getRoleForEmail,
  isAllowedEmail,
  normalizeEmail,
  type UserRole,
} from "./constants";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  canManage: boolean;
  canAdd: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionIsAllowed(session: Session | null): session is Session {
  return Boolean(session?.user.email && isAllowedEmail(session.user.email));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      const next = data.session;
      if (!sessionIsAllowed(next)) {
        if (next) await supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(next);
      }
      setLoading(false);
    }

    void loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!sessionIsAllowed(nextSession)) {
        setSession(null);
        return;
      }
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const role = getRoleForEmail(session?.user.email);
  const isAdmin = role === "admin";

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      role,
      isAdmin,
      canManage: isAdmin,
      canAdd: role === "admin" || role === "user",
      signIn: async (email, password) => {
        const normalized = normalizeEmail(email);
        if (!isAllowedEmail(normalized)) {
          throw new Error("unauthorized");
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: normalized,
          password,
        });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [isAdmin, loading, role, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
