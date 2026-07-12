import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ClipboardCheck, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, Kpi, PageHeader, ProgressBar, SectionLabel, BeltTag } from "@/components/dashboard/primitives";
import { DAYS, MY_ATTENDANCE } from "@/lib/data";
import { type Student } from "@/lib/data";
import { useClasses, useStudents, useSaveAttendance, useAttendanceToday } from "@/lib/db/queries";

export const Route = createFileRoute("/dashboard/presenca")({
  head: () => ({ meta: [{ title: "Presença — X BJJ School" }] }),
  component: Presenca,
});

function Presenca() {
  const { isStaff } = useAuth();
  return isStaff ? <AdmPresenca /> : <AlunoPresenca />;
}

// Quem faz parte da turma daquela aula (mapeamento por público).
function rosterFor(title: string, students: Student[]): Student[] {
  if (title.includes("Kids")) return students.filter((s) => s.category === "Juvenil" || s.category === "Infantil");
  if (title.includes("Adulto")) return students.filter((s) => s.category === "Adultos");
  return students; // Livre / open
}

// ——————————————————————— STAFF: CHAMADA MANUAL ———————————————————————
function AdmPresenca() {
  const { data: classes = [] } = useClasses();
  const { data: students = [] } = useStudents();
  const { data: todayCount = 0 } = useAttendanceToday();
  const save = useSaveAttendance();

  const [classId, setClassId] = useState("");
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  // Seleção inicial: primeira aula de hoje, senão a primeira da lista.
  useEffect(() => {
    if (!classId && classes.length) {
      const today = new Date().getDay();
      const todays = classes.filter((c) => c.day === today);
      setClassId((todays[0] ?? classes[0]).id);
    }
  }, [classes, classId]);

  const cls = classes.find((c) => c.id === classId);
  const roster = useMemo(() => (cls ? rosterFor(cls.title, students) : []), [cls, students]);

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

  function salvar() {
    if (!cls || present.size === 0) return;
    save.mutate(
      { classId: cls.id, studentIds: [...present] },
      { onSuccess: () => setSaved(true) },
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="CHAMADA"
        title="Presença"
        actions={
          <button
            onClick={salvar}
            disabled={present.size === 0 || saved || save.isPending}
            className="text-display inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            <ClipboardCheck className="h-4 w-4" />
            {saved ? "Chamada salva ✓" : save.isPending ? "Salvando…" : `Salvar (${present.size})`}
          </button>
        }
      />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
        <Kpi label="Presenças hoje" value={todayCount} hint="registradas no banco" />
        <Kpi label="Alunos na turma" value={roster.length} hint={cls ? `${DAYS[cls.day]} · ${cls.start}` : "—"} />
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <SectionLabel>Aula</SectionLabel>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="text-display mt-2 w-full max-w-xs border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{DAYS[c.day]} · {c.start} · {c.title}</option>
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
            Chamada salva no banco — {present.size} presente(s).
          </div>
        ) : null}

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((s) => {
            const on = present.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`flex items-center gap-3 border p-3 text-left transition ${on ? "border-foreground bg-accent" : "border-border hover:border-foreground/40"}`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs ${on ? "bg-foreground text-background" : "bg-accent"}`}>
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
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">Selecione uma aula com alunos.</div>
          ) : null}
        </div>
      </Card>
    </div>
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

      <Card className="flex flex-col items-center py-12 text-center">
        <Users className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
        <SectionLabel>Como funciona</SectionLabel>
        <p className="mt-2 max-w-[14rem] text-xs text-muted-foreground">
          Sua presença é registrada pelo professor na chamada, ao fim de cada aula.
        </p>
        <ProgressBar value={0} className="mt-6 w-40" />
      </Card>
    </div>
  );
}
