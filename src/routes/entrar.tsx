import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { XLogo } from "@/components/XLogo";

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — X BJJ School" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Entrar,
});

function Entrar() {
  const { user, signInWithCode } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await signInWithCode(code);
    setBusy(false);
    if (error) setErr(error);
    else window.location.href = "/dashboard";
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-sm text-center">
        <XLogo className="mx-auto h-14 w-14" />
        <h1 className="text-display mt-6 text-3xl">Área do Aluno</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Informe sua matrícula para ver treinos, presença, faixa e mensalidade.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4 border border-border bg-card p-6">
          <label className="block text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Número de matrícula</span>
            <input
              required
              autoFocus
              autoCapitalize="characters"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XXXXXX"
              className="text-display mt-1.5 w-full border border-border bg-background px-3 py-3 text-center text-2xl tracking-[0.3em] outline-none transition focus:border-foreground"
            />
          </label>

          {err ? <div className="text-xs text-red-400">{err}</div> : null}

          <button
            type="submit"
            disabled={busy || code.trim().length < 4}
            className="text-display w-full bg-primary px-6 py-3 text-sm text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
          <p className="text-[11px] text-muted-foreground">
            Não tem a matrícula? Peça ao seu professor.
          </p>
        </form>

        <div className="mt-6 border border-border bg-background p-6 text-left">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Ainda não treina com a gente?</div>
          <Link
            to="/agendar"
            className="text-display mt-3 inline-flex items-center gap-2 border border-border px-5 py-3 text-sm transition hover:bg-accent"
          >
            Aula experimental <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Link to="/" className="mt-8 inline-block text-xs text-muted-foreground transition hover:text-foreground">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
