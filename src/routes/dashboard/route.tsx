import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X as XIcon, LogOut } from "lucide-react";
import { XLogo } from "@/components/XLogo";
import { useAuth, type Role } from "@/lib/auth";
import { navForRole, labelFor } from "@/lib/nav";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: DashboardLayout,
});

const ROLE_BADGE: Record<Role, string> = { aluno: "ALUNO", mestre: "MESTRE", adm: "ADMIN" };

function DashboardLayout() {
  const { loading, user, devMode } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Guards (fora do modo dev):
  //  • sem sessão → entrada do aluno
  //  • logado como aluno mas SEM matrícula vinculada → tela de matrícula
  //    (visitante só acessa o agendamento da aula experimental)
  useEffect(() => {
    if (loading || devMode) return;
    if (!user) navigate({ to: "/entrar" });
    else if (user.role === "aluno" && !user.studentId) navigate({ to: "/matricula" });
  }, [loading, devMode, user, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-display text-sm tracking-[0.3em] text-muted-foreground">CARREGANDO…</div>
      </div>
    );
  }
  if (!devMode && !user) return null; // redirecionando

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { role } = useAuth();
  const location = useLocation();
  const items = navForRole(role ?? "aluno");

  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={onClose} /> : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border p-5">
          <Link to="/" className="flex items-center gap-3">
            <XLogo className="h-9 w-9" />
            <div className="leading-none">
              <div className="text-display text-xs">X BJJ School</div>
              <div className="mt-1 text-[9px] tracking-[0.25em] text-muted-foreground">
                {ROLE_BADGE[role ?? "aluno"]}
              </div>
            </div>
          </Link>
          <button className="text-muted-foreground md:hidden" onClick={onClose} aria-label="Fechar menu">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-auto p-3">
          {items.map((item) => {
            const active =
              item.to === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {labelFor(item, role ?? "aluno")}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          X BJJ School · desde 2024
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const { user, role, devMode, devSetRole, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 sm:px-6">
      <button className="text-foreground md:hidden" onClick={onMenu} aria-label="Abrir menu">
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
        {/* Seletor de papel — só no preview local (sem Supabase) */}
        {devMode ? (
          <div className="flex items-center gap-1 border border-border p-0.5">
            {(["aluno", "mestre", "adm"] as const).map((r) => (
              <button
                key={r}
                onClick={() => devSetRole(r)}
                className={`px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] transition ${
                  role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        ) : null}

        {user ? (
          <>
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium leading-tight">{user.name}</div>
              <div className="text-[11px] text-muted-foreground">{user.subtitle}</div>
            </div>
            <div className="text-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-sm">
              {user.initials}
            </div>
            {!devMode ? (
              <button onClick={() => signOut()} className="text-muted-foreground transition hover:text-foreground" aria-label="Sair">
                <LogOut className="h-4 w-4" />
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </header>
  );
}
