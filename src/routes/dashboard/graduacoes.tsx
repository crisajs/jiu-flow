import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, CalendarDays } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, PageHeader, ProgressBar, SectionLabel, BeltTag } from "@/components/dashboard/primitives";
import { NEXT_CEREMONY, GRAD_CANDIDATES, MY_GRADUATION, MY_BELT_HISTORY } from "@/lib/data";
import { BELTS, nextBelt } from "@/lib/belts";

export const Route = createFileRoute("/dashboard/graduacoes")({
  head: () => ({ meta: [{ title: "Graduações — X BJJ School" }] }),
  component: Graduacoes,
});

function Graduacoes() {
  const { isStaff } = useAuth();
  return isStaff ? <AdmGraduacoes /> : <AlunoGraduacoes />;
}

function AdmGraduacoes() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="EVOLUÇÃO"
        title="Graduações"
        actions={
          <button className="text-display bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90">
            Agendar cerimônia
          </button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Eyebrow>PRÓXIMA CERIMÔNIA</Eyebrow>
            <h2 className="text-display mt-2 text-2xl">{NEXT_CEREMONY.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{NEXT_CEREMONY.location}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {new Date(NEXT_CEREMONY.date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </div>
        </div>
      </Card>

      <div>
        <SectionLabel>Candidatos · {GRAD_CANDIDATES.length}</SectionLabel>
        <div className="mt-3 space-y-2">
          {GRAD_CANDIDATES.map((g) => (
            <div key={g.studentName} className="flex flex-wrap items-center gap-4 border border-border bg-card p-4">
              <span className="text-display grid h-9 w-9 place-items-center rounded-full bg-accent text-xs">{g.initials}</span>
              <div className="min-w-[10rem] flex-1">
                <div className="text-sm font-medium">{g.studentName}</div>
                <div className="text-xs text-muted-foreground">
                  {g.kind === "faixa" ? `${BELTS[g.from].label} → ${BELTS[g.to].label}` : `${BELTS[g.to].label} · +1 grau`}
                </div>
              </div>
              <BeltTag belt={g.to} showLabel={false} />
              <div className="w-40">
                <div className="flex justify-between text-[11px] text-muted-foreground"><span>Preparo</span><span>{g.readiness}%</span></div>
                <ProgressBar value={g.readiness} className="mt-1 h-1.5" />
              </div>
              <button className="text-display border border-border px-3 py-2 text-[10px] uppercase tracking-wider transition hover:bg-accent">
                Aprovar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlunoGraduacoes() {
  const tgt = nextBelt(MY_GRADUATION.current.belt);
  const targetLabel =
    MY_GRADUATION.target.belt === MY_GRADUATION.current.belt
      ? `${BELTS[MY_GRADUATION.current.belt].label} · ${MY_GRADUATION.target.stripes}º grau`
      : tgt?.label ?? "—";

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="MEU CAMINHO" title="Minha Evolução" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Eyebrow>FAIXA ATUAL</Eyebrow>
          <div className="mt-4 flex items-center gap-4">
            <BeltTag belt={MY_GRADUATION.current.belt} stripes={MY_GRADUATION.current.stripes} showLabel={false} />
            <span className="text-display text-2xl">{BELTS[MY_GRADUATION.current.belt].label}</span>
            <span className="text-sm text-muted-foreground">{MY_GRADUATION.current.stripes} graus</span>
          </div>

          <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
            <span>Próximo: {targetLabel}</span>
            <span>{MY_GRADUATION.progress}%</span>
          </div>
          <ProgressBar value={MY_GRADUATION.progress} className="mt-1" />
          <div className="mt-2 text-xs text-muted-foreground">
            {MY_GRADUATION.classesAttended} de {MY_GRADUATION.classesRequired} aulas no ciclo
          </div>

          <div className="mt-8">
            <SectionLabel>Checklist técnico</SectionLabel>
            <ul className="mt-4 space-y-3">
              {MY_GRADUATION.requirements.map((r) => (
                <li key={r.label} className="flex items-center gap-3 text-sm">
                  {r.done ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span className={r.done ? "" : "text-muted-foreground"}>{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <Eyebrow>HISTÓRICO DE FAIXAS</Eyebrow>
          <ol className="mt-5 space-y-5">
            {MY_BELT_HISTORY.map((h) => (
              <li key={h.belt} className="flex gap-3">
                <BeltTag belt={h.belt} showLabel={false} />
                <div>
                  <div className="text-sm">{BELTS[h.belt].label}</div>
                  <div className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString("pt-BR")}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{h.note}</div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
