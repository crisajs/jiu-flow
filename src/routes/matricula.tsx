import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { XLogo } from "@/components/XLogo";

// Tela do "visitante": logou (Google) mas ainda não está vinculado a uma
// matrícula. Ou reivindica o acesso com o código, ou agenda a aula experimental.
export const Route = createFileRoute("/matricula")({
  head: () => ({ meta: [{ title: "Sua matrícula — X BJJ School" }] }),
  component: Matricula,
});

function Matricula() {
  const { user, signOut, devMode } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Já vinculado (ou é staff) → vai pro painel.
  useEffect(() => {
    if (user && (user.role !== "aluno" || user.studentId)) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    if (!isSupabaseConfigured) {
      setErr("A confirmação de matrícula fica ativa quando o banco estiver conectado.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.rpc("claim_enrollment", { p_code: code.trim() });
    setBusy(false);
    if (error) setErr(error.message);
    else if (data === true) window.location.href = "/dashboard"; // recarrega com o perfil vinculado
    else setErr("Matrícula não encontrada ou já vinculada. Confira com a recepção.");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3">
          <XLogo className="h-10 w-10" />
          <div className="text-display text-sm">X BJJ School</div>
        </div>

        <h1 className="text-display mt-8 text-3xl">Você já é aluno?</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {user ? `Você entrou como ${user.name}. ` : ""}
          Informe seu <span className="text-foreground">número de matrícula</span> para liberar a área do aluno.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4 border border-border bg-card p-6">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Número de matrícula</span>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex.: XBJJ-0031"
              className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-foreground"
            />
          </label>
          {err ? <div className="text-xs text-red-400">{err}</div> : null}
          <button
            type="submit"
            disabled={busy}
            className="text-display w-full bg-primary px-6 py-3 text-sm text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Verificando…" : "Liberar acesso"}
          </button>
          <p className="text-[11px] text-muted-foreground">
            Não tem a matrícula? Peça ao seu professor ou na recepção.
          </p>
        </form>

        <div className="mt-6 border border-border bg-background p-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Ainda não treina com a gente?</div>
          <Link
            to="/agendar"
            className="text-display mt-3 inline-flex items-center gap-2 border border-border px-5 py-3 text-sm transition hover:bg-accent"
          >
            Agendar aula experimental <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!devMode ? (
          <button
            onClick={() => signOut()}
            className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        ) : null}
      </div>
    </div>
  );
}
