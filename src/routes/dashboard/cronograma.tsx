import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/primitives";
import { DAYS, DAYS_FULL, categoryHex, gearLabel, type ClassSession } from "@/lib/data";
import { useClasses } from "@/lib/db/queries";

export const Route = createFileRoute("/dashboard/cronograma")({
  head: () => ({ meta: [{ title: "Cronograma — X BJJ School" }] }),
  component: Cronograma,
});

function Cronograma() {
  const { isStaff } = useAuth();
  const { data: classes = [], isLoading } = useClasses();
  const byDay = useMemo(
    () => DAYS.map((_, day) => classes.filter((c) => c.day === day).sort((a, b) => a.start.localeCompare(b.start))),
    [classes],
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="AGENDA SEMANAL"
        title="Cronograma"
        actions={
          isStaff ? (
            <button className="text-display bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90">
              + Nova aula
            </button>
          ) : undefined
        }
      />

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {(["Gi", "No-Gi"] as const).map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2" style={{ backgroundColor: categoryHex(c) }} />
            {gearLabel(c)}
          </span>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Carregando aulas…</div>
      ) : classes.length === 0 ? (
        <div className="border border-border bg-card py-16 text-center text-sm text-muted-foreground">Nenhuma aula cadastrada ainda.</div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {DAYS.map((_, day) => {
          if (day === 0) return null; // sem aulas no domingo
          const classes = byDay[day];
          if (!classes.length) return null;
          return (
            <div key={day} className="border border-border bg-card">
              <div className="border-b border-border px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {DAYS_FULL[day]}
              </div>
              <div className="divide-y divide-border">
                {classes.map((c) => (
                  <ClassRow key={c.id} c={c} isAdm={isStaff} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClassRow({ c, isAdm }: { c: ClassSession; isAdm: boolean }) {
  const [going, setGoing] = useState(false);

  return (
    <div className="flex items-stretch gap-3 p-4">
      <span className="w-1 shrink-0" style={{ backgroundColor: categoryHex(c.category) }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-display text-sm">{c.start}–{c.end}</span>
          <span
            className="border px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
            style={{ color: categoryHex(c.category), borderColor: categoryHex(c.category) }}
          >
            {gearLabel(c.category)}
          </span>
        </div>
        <div className="mt-1.5 text-sm">{c.title}</div>
        {!isAdm ? (
          <button
            onClick={() => setGoing((v) => !v)}
            className={`text-display mt-2 border px-3 py-1.5 text-[10px] uppercase tracking-wider transition ${
              going
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {going ? "Confirmado ✓" : "Vou treinar"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
