import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";
import { CURRENT_STUDENT } from "./data";
import { beltLabel } from "./belts";

// Papéis da plataforma.
export type Role = "aluno" | "mestre" | "adm";

export type AuthUser = {
  role: Role;
  name: string;
  initials: string;
  subtitle: string;
  /** id do aluno vinculado (quando role = aluno) */
  studentId: string | null;
};

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

const ROLE_LABEL: Record<Role, string> = { aluno: "Aluno", mestre: "Mestre", adm: "Administrador" };

// Usuário de demonstração por papel (usado no fallback dev, sem Supabase).
function mockUser(role: Role): AuthUser {
  if (role === "aluno") {
    return {
      role,
      name: CURRENT_STUDENT.name,
      initials: CURRENT_STUDENT.initials,
      subtitle: `Aluno · ${beltLabel(CURRENT_STUDENT.belt, CURRENT_STUDENT.stripes)}`,
      studentId: CURRENT_STUDENT.id,
    };
  }
  const name = role === "mestre" ? "Mestre Xavier" : "Administrador";
  return { role, name, initials: initials(name), subtitle: ROLE_LABEL[role], studentId: null };
}

type AuthContextValue = {
  loading: boolean;
  role: Role | null;
  user: AuthUser | null;
  isStaff: boolean; // mestre || adm
  isAdm: boolean;
  /** true quando não há Supabase configurado (preview local com seletor de papel) */
  devMode: boolean;
  devSetRole: (r: Role) => void;
  signInWithGoogle: () => Promise<void>;
  signInStaff: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEV_KEY = "jiu-flow-dev-role";

export function AuthProvider({ children }: { children: ReactNode }) {
  return isSupabaseConfigured ? <SupabaseAuth>{children}</SupabaseAuth> : <DevAuth>{children}</DevAuth>;
}

// —————————————————— Modo real (Supabase) ——————————————————
function SupabaseAuth({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile(s: Session | null) {
      if (!s) {
        if (active) setUser(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role, student_id, full_name")
        .eq("id", s.user.id)
        .maybeSingle();
      if (!active) return;
      const role = (data?.role ?? "aluno") as Role;
      const name = data?.full_name || (s.user.user_metadata?.full_name as string) || s.user.email || "Usuário";
      setUser({ role, name, initials: initials(name), subtitle: ROLE_LABEL[role], studentId: data?.student_id ?? null });
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session);
      if (active) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      loadProfile(s);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    loading,
    role: user?.role ?? null,
    user,
    isStaff: user?.role === "mestre" || user?.role === "adm",
    isAdm: user?.role === "adm",
    devMode: false,
    devSetRole: () => {},
    signInWithGoogle: async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
    },
    signInStaff: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
  void session;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// —————————————————— Fallback dev (sem Supabase) ——————————————————
function DevAuth({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("adm");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(DEV_KEY) : null;
    if (saved === "aluno" || saved === "mestre" || saved === "adm") setRole(saved);
  }, []);

  const devSetRole = (r: Role) => {
    setRole(r);
    if (typeof window !== "undefined") window.localStorage.setItem(DEV_KEY, r);
  };

  const value: AuthContextValue = {
    loading: false,
    role,
    user: mockUser(role),
    isStaff: role !== "aluno",
    isAdm: role === "adm",
    devMode: true,
    devSetRole,
    signInWithGoogle: async () => {},
    signInStaff: async () => ({ error: "Supabase não configurado (modo dev)." }),
    signOut: async () => {},
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
