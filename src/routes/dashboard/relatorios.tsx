import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Restricted, Card, Eyebrow, Kpi } from "@/components/dashboard/primitives";
import { STUDENTS, beltCounts, REVENUE_12M, SCHOOL, brl } from "@/lib/data";
import { ADULT_ORDER, BELTS } from "@/lib/belts";

export const Route = createFileRoute("/dashboard/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — X BJJ School" }] }),
  component: () => (
    <Restricted allow={["mestre", "adm"]}>
      <Relatorios />
    </Restricted>
  ),
});

function Relatorios() {
  const counts = beltCounts();
  const totalBelts = Object.values(counts).reduce((a, b) => a + b, 0);

  const categories = STUDENTS.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(categories));
  const firstRev = REVENUE_12M[0].value;
  const lastRev = REVENUE_12M[REVENUE_12M.length - 1].value;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="INTELIGÊNCIA"
        title="Relatórios"
        actions={
          <button className="text-display border border-border px-4 py-2.5 text-xs transition hover:bg-accent">
            Exportar PDF
          </button>
        }
      />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Alunos ativos" value={SCHOOL.stats.activeStudents} hint="base atual" />
        <Kpi label="Crescimento 12m" value="+89%" hint={`${brl(firstRev)} → ${brl(lastRev)}`} />
        <Kpi label="Retenção" value={`${SCHOOL.stats.monthlyRetention}%`} hint="média mensal" />
        <Kpi label="Graduações" value={SCHOOL.stats.graduationsDone} hint="desde a abertura" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Eyebrow>DISTRIBUIÇÃO POR FAIXA</Eyebrow>
          <div className="mt-6 space-y-3">
            {ADULT_ORDER.map((b) => {
              const n = counts[b] ?? 0;
              const pct = Math.round((n / totalBelts) * 100);
              return (
                <div key={b}>
                  <div className="flex justify-between text-sm">
                    <span>{BELTS[b].label}</span>
                    <span className="text-muted-foreground">{n} · {pct}%</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full overflow-hidden bg-muted">
                    <div className="h-full" style={{ width: `${pct}%`, backgroundColor: BELTS[b].hex }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <Eyebrow>ALUNOS POR TURMA</Eyebrow>
          <div className="mt-8 flex h-56 items-end gap-3">
            {Object.entries(categories).map(([cat, n]) => (
              <div key={cat} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{n}</span>
                <div className="w-full bg-foreground/80 transition group-hover:bg-foreground" style={{ height: `${(n / maxCat) * 100}%` }} />
                <span className="text-center text-[9px] uppercase leading-tight tracking-wider text-muted-foreground">{cat}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
