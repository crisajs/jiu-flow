import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { XLogo } from "@/components/XLogo";

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — X BJJ School" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Entrar,
});

function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5c-2.1 1.6-4.8 2.5-7.6 2.5-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5c-.5.4 7.3-5.3 7.3-15 0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Entrar() {
  const { user, devMode, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <XLogo className="mx-auto h-14 w-14" />
        <h1 className="text-display mt-6 text-3xl">Área do Aluno</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Entre para ver seus treinos, presença, evolução de faixa e mensalidade.
        </p>

        <button
          onClick={() => signInWithGoogle()}
          className="mt-8 flex w-full items-center justify-center gap-3 border border-border bg-card px-6 py-4 text-sm transition hover:bg-accent"
        >
          <GoogleG />
          Entrar com Google
        </button>

        {devMode ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Supabase não configurado (modo preview) — o login real ativa quando o projeto estiver conectado.
          </p>
        ) : null}

        <Link to="/" className="mt-8 inline-block text-xs text-muted-foreground transition hover:text-foreground">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
