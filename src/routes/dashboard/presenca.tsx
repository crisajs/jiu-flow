import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ClipboardCheck, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, Kpi, PageHeader, ProgressBar, SectionLabel, BeltTag } from "@/components/dashboard/primitives";
import { ATTENDANCE_BY_WEEKDAY, MY_ATTENDANCE, SCHEDULE, DAYS, nextSession, STUDENTS, type Student } from "@/lib/data";

export const Route = createFileRoute("/dashboard/presenca")({
  head: () => ({ meta: [{ title: "Presença — X BJJ School" }] }),
  component: Presenca,
});

function Presenca() {
  const { isStaff } = useAuth();
  return isStaff ? <AdmPresenca /> : <AlunoPresenca />;
}

// Quem faz parte da turma daquela aula (mapeamento por público).
function rosterFor(title: string): Student[] {
  if (title.includes("Kids")) return STUDENTS.filter((s) => s.category === "Juvenil" || s.category === "Infantil");
  if (title.includes("Adulto")) return STUDENTS.filter((s) => s.category === "Adultos");
  return STUDENTS; // Livre / open
}

const classLabel = (id: string) => {
  const c = SCHEDULE.find((s) => s.id === id)!;
  return `${DAYS[c.day]} · ${c.start} · ${c.title}`;
};

// ——————————————————————— STAFF: CHAMADA MANUAL ———————————————————————
function AdmPresenca() {
  const [classId, setClassId] = useState(nextSession()?.id ?? SCHEDULE[0].id);
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  const cls = SCHEDULE.find((s) => s.id === classId)!;
  const roster = useMemo(() => rosterFor(cls.title), [cls.title]);

  // Troca de aula → zera a chamada.
  useEffect(() => {
    setPresent(new Set());
    setSaved(false);
  }, [classId]);

  const toggle = (id: string) => {
    setSaved(false);
    setPresent((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allPresent = present.size === roster.length && roster.length > 0;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="CHAMADA"
        title="Presença"
        actions={
          <button
            onClick={() => setSaved(true)}
            disabled={present.size === 0 || saved}
            className="text-display inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            <ClipboardCheck className="h-4 w-4" />
            {saved ? "Chamada salva ✓" : `Salvar (${present.size})`}
          </button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <SectionLabel>Aula</SectionLabel>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="text-display mt-2 w-full max-w-xs border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground"
            >
              {SCHEDULE.map((s) => (
                <option key={s.id} value={s.id}>{classLabel(s.id)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-display text-3xl">{present.size}<span className="text-lg text-muted-foreground">/{roster.length}</span></div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">presentes</div>
            </div>
            <button
              onClick={() => setPresent(allPresent ? new Set() : new Set(roster.map((s) => s.id)))}
              className="text-display border border-border px-3 py-2 text-[10px] uppercase tracking-wider transition hover:bg-accent"
            >
              {allPresent ? "Limpar" : "Marcar todos"}
            </button>
          </div>
        </div>

        {saved ? (
          <div className="mt-4 border border-green-600/40 bg-green-600/5 px-4 py-3 text-xs text-green-400">
            Chamada salva — {present.size} presente(s) em {cls.title} ({DAYS[cls.day]} {cls.start}).
          </div>
        ) : null}

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((s) => {
            const on = present.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`flex items-center gap-3 border p-3 text-left transition ${
                  on ? "border-foreground bg-accent" : "border-border hover:border-foreground/40"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs ${
                    on ? "bg-foreground text-background" : "bg-accent"
                  }`}
                >
                  {on ? <Check className="h-4 w-4" /> : s.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{s.name}</span>
                  <BeltTag belt={s.belt} stripes={s.stripes} size="sm" showLabel={false} />
                </span>
              </button>
            );
          })}
          {roster.length === 0 ? (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">Nenhum aluno nesta turma.</div>
          ) : null}
        </div>
      </Card>

      <FrequenciaChart />
    </div>
  );
}

function FrequenciaChart() {
  const max = Math.max(...ATTENDANCE_BY_WEEKDAY.map((d) => d.value));
  return (
    <Card>
      <Eyebrow>PRESENÇA MÉDIA POR DIA</Eyebrow>
      <div className="mt-8 flex h-40 items-end gap-3">
        {ATTENDANCE_BY_WEEKDAY.map((d) => (
          <div key={d.day} className="group flex flex-1 flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">{d.value}%</span>
            <div className="w-full bg-foreground/80 transition group-hover:bg-foreground" style={{ height: `${(d.value / max) * 100}%` }} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ——————————————————————— ALUNO: MINHA FREQUÊNCIA ———————————————————————
function AlunoPresenca() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="MINHA FREQUÊNCIA" title="Minha Presença" />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <Kpi label="Sequência atual" value={MY_ATTENDANCE.streak} hint="aulas seguidas" />
        <Kpi label="Este mês" value={`${MY_ATTENDANCE.thisMonth}/${MY_ATTENDANCE.monthGoal}`} hint="meta mensal" />
        <Kpi label="Frequência" value={`${MY_ATTENDANCE.rate}%`} hint="no ciclo da faixa" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center text-center">
          <Users className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
          <SectionLabel>Como funciona</SectionLabel>
          <p className="mt-2 max-w-[13rem] text-xs text-muted-foreground">
            Sua presença é registrada pelo professor na chamada, ao fim de cada aula.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <Eyebrow>HISTÓRICO RECENTE</Eyebrow>
          <ul className="mt-5 divide-y divide-border">
            {MY_ATTENDANCE.recent.map((d) => (
              <li key={d.date} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm">{d.className}</div>
                  <div className="text-xs text-muted-foreground">{new Date(d.date + "T00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })}</div>
                </div>
                <span className={`text-xs ${d.present ? "text-green-400" : "text-red-400"}`}>
                  {d.present ? "Presente" : "Falta"}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Meta do mês</span>
              <span>{Math.round((MY_ATTENDANCE.thisMonth / MY_ATTENDANCE.monthGoal) * 100)}%</span>
            </div>
            <ProgressBar value={(MY_ATTENDANCE.thisMonth / MY_ATTENDANCE.monthGoal) * 100} className="mt-1" />
          </div>
        </Card>
      </div>
    </div>
  );
}
