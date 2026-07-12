import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { BELTS, beltLabel, type BeltId } from "@/lib/belts";
import { useAuth, type Role } from "@/lib/auth";

// ——— Tipografia / blocos reutilizáveis das telas do dashboard ———

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-[10px] tracking-[0.3em] text-muted-foreground">{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-display mt-1 text-2xl sm:text-3xl">{title}</h1>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-border bg-card p-6 ${className}`}>{children}</div>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{children}</div>;
}

export function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="bg-card p-6">
      <SectionLabel>{label}</SectionLabel>
      <div className="text-display mt-3 text-3xl">{value}</div>
      {hint ? <div className="mt-2 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden bg-muted ${className}`}>
      <div className="h-full bg-foreground" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

// Faixa realista com ponteira e graus (stripes). A ponteira é preta (ou
// vermelha na faixa-preta) e os graus são marcas brancas sobre ela.
export function BeltTag({
  belt,
  stripes = 0,
  showLabel = true,
  size = "md",
}: {
  belt: BeltId;
  stripes?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const b = BELTS[belt];
  const isBlack = belt === "preta";
  const rankBg = isBlack ? "bg-red-700" : "bg-neutral-950";
  const dims = size === "lg" ? "h-6 w-24" : size === "sm" ? "h-3.5 w-14" : "h-5 w-[4.75rem]";
  const n = Math.min(4, stripes);

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`relative flex shrink-0 items-center overflow-hidden rounded-full ring-1 ring-black/25 ${dims} ${b.bg}`}
        style={{ boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.28), inset 0 -2px 3px rgba(0,0,0,0.28)" }}
        title={beltLabel(belt, stripes)}
        aria-label={beltLabel(belt, stripes)}
      >
        {/* ponteira (rank bar) com os graus — posicionada como numa faixa real */}
        <span className={`absolute inset-y-0 right-[13%] flex w-[34%] items-center justify-evenly px-[3px] ${rankBg}`}>
          {Array.from({ length: n }).map((_, i) => (
            <span key={i} className="h-1/2 w-[2px] rounded-full bg-white/90 shadow-[0_0_1px_rgba(0,0,0,0.4)]" />
          ))}
        </span>
      </span>
      {showLabel ? <span className="text-xs font-medium">{beltLabel(belt, stripes)}</span> : null}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ativo: "border-green-600/40 text-green-400",
    pago: "border-green-600/40 text-green-400",
    inadimplente: "border-red-600/40 text-red-400",
    atrasado: "border-red-600/40 text-red-400",
    experimental: "border-blue-600/40 text-blue-400",
    pendente: "border-amber-600/40 text-amber-400",
  };
  return (
    <span className={`inline-flex border px-2 py-0.5 text-[10px] uppercase tracking-wider ${map[status] ?? "border-border text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// Guarda de perfil: renderiza o conteúdo só para os papéis permitidos.
export function Restricted({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { role } = useAuth();
  if (role && allow.includes(role)) return <>{children}</>;
  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <div className="max-w-sm border border-border bg-card p-10 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        <h2 className="text-display mt-5 text-xl">Acesso restrito</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta área não está disponível para o seu perfil.
        </p>
        <Link
          to="/dashboard"
          className="text-display mt-6 inline-flex border border-border px-5 py-3 text-xs transition hover:bg-accent"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
