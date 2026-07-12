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
  const { user, devMode, signInStaff, signInWithGoogle } = useAuth();
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

        {/* Recuperação: entrar pela conta Google do mesmo e-mail (mesma conta) */}
        <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>
        <button
          onClick={() => signInWithGoogle()}
          className="mt-4 flex w-full items-center justify-center gap-3 border border-border bg-card px-6 py-3 text-sm transition hover:bg-accent"
        >
          <GoogleG /> Entrar com Google
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Esqueceu a senha? Entre pelo Google do mesmo e-mail da conta.
        </p>
      </div>
    </div>
  );
}

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5c-2.1 1.6-4.8 2.5-7.6 2.5-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5c-.5.4 7.3-5.3 7.3-15 0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
