import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { XLogo } from "@/components/XLogo";

// Login da EQUIPE (Mestre/ADM). Rota oculta e não-linkada — acesso só por URL.
// Autenticação por e-mail + senha, separada da entrada dos alunos (Google).
export const Route = createFileRoute("/gestao")({
  head: () => ({ meta: [{ title: "Gestão — X BJJ School" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Gestao,
});

function Gestao() {
  const { user, devMode, signInStaff } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await signInStaff(email.trim(), password);
    setBusy(false);
    if (error) setErr(error);
    else navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <XLogo className="h-10 w-10" />
          <div>
            <div className="text-display text-sm">X BJJ School</div>
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <Lock className="h-3 w-3" /> Acesso da equipe
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 border border-border bg-card p-6">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-foreground"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Senha</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-foreground"
            />
          </label>

          {err ? <div className="text-xs text-red-400">{err}</div> : null}
          {devMode ? (
            <div className="text-xs text-muted-foreground">Supabase não configurado (modo preview).</div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="text-display w-full bg-primary px-6 py-3 text-sm text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
