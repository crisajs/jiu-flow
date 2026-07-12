import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Flame, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, Kpi, PageHeader, ProgressBar, SectionLabel } from "@/components/dashboard/primitives";
import { SCHOOL, FINANCE_SUMMARY, DAYS_FULL, gearLabel, MY_ATTENDANCE, brl, type ClassSession } from "@/lib/data";
import { useStudents, useClasses, useAttendanceToday } from "@/lib/db/queries";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — X BJJ School" }] }),
  component: Home,
});

function Home() {
  const { isStaff } = useAuth();
  return isStaff ? <AdminHome /> : <StudentHome />;
}

function nextClass(classes: ClassSession[]): ClassSession | undefined {
  const now = new Date();
  const today = now.getDay();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  for (let off = 0; off < 7; off++) {
    const day = (today + off) % 7;
    const cands = classes
      .filter((c) => c.day === day && (off > 0 || c.start > hhmm))
      .sort((a, b) => a.start.localeCompare(b.start));
    if (cands.length) return cands[0];
  }
  return classes[0];
}

// ——————————————————————— ADMIN / MESTRE ———————————————————————
function AdminHome() {
  const { role } = useAuth();
  const showFinance = role === "mestre";
  const { data: students = [] } = useStudents();
  const { data: todayCount = 0 } = useAttendanceToday();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="PAINEL EXECUTIVO" title="Visão Geral" />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <Kpi label="Alunos Ativos" value={students.length} hint="base atual" />
        <Kpi label="Presenças Hoje" value={todayCount} hint="registradas no banco" />
        {showFinance ? (
          <Kpi label="Receita do Mês" value={brl(FINANCE_SUMMARY.monthlyRevenue)} hint="a contabilizar" />
        ) : (
          <Kpi label="Professores" value={SCHOOL.stats.blackBeltProfessors} hint="faixas-preta" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Eyebrow>PRESENÇA</Eyebrow>
          <div className="text-display mt-2 text-6xl">{todayCount}</div>
          <div className="mt-2 text-sm text-muted-foreground">presenças registradas hoje</div>
          <Link to="/dashboard/presenca" className="text-display mt-6 inline-block border border-border px-5 py-3 text-xs transition hover:bg-accent">
            Fazer chamada →
          </Link>
        </Card>

        <Card className="flex flex-col">
          <Eyebrow>ALUNOS</Eyebrow>
          <div className="text-display mt-2 text-5xl">{students.length}</div>
          <div className="mt-1 flex-1 text-xs text-muted-foreground">ativos na escola</div>
          <Link to="/dashboard/alunos" className="text-display mt-6 block w-full border border-border px-4 py-3 text-center text-xs transition hover:bg-accent">
            Ver alunos
          </Link>
        </Card>
      </div>
    </div>
  );
}

// ——————————————————————— ALUNO ———————————————————————
function StudentHome() {
  const { user } = useAuth();
  const { data: classes = [] } = useClasses();
  const next = nextClass(classes);
  const firstName = (user?.name ?? "Aluno").split(" ")[0];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="MEU PAINEL" title={`Olá, ${firstName}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            <SectionLabel>Próxima aula</SectionLabel>
          </div>
          {next ? (
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-display text-3xl">{next.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {DAYS_FULL[next.day]} · {next.start}–{next.end} · {gearLabel(next.category)}
                </p>
              </div>
              <Link to="/dashboard/cronograma" className="text-display border border-border px-5 py-3 text-xs transition hover:bg-accent">
                Ver cronograma
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Nenhuma aula cadastrada.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4" />
            <SectionLabel>Sequência</SectionLabel>
          </div>
          <div className="text-display mt-3 text-5xl">{MY_ATTENDANCE.streak}</div>
          <div className="mt-1 text-xs text-muted-foreground">aulas seguidas</div>
          <ProgressBar value={(MY_ATTENDANCE.thisMonth / MY_ATTENDANCE.monthGoal) * 100} className="mt-5" />
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-4 w-4" />
          <SectionLabel>Mensalidade</SectionLabel>
        </div>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Pague sua mensalidade via Pix — o valor é o combinado com a escola.
        </p>
        <Link to="/dashboard/financeiro" className="text-display mt-6 inline-block bg-primary px-6 py-3 text-center text-xs text-primary-foreground transition hover:bg-primary/90">
          Pagar via Pix
        </Link>
      </Card>
    </div>
  );
}
