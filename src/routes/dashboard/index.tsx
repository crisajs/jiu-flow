import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarClock, Flame, Trophy, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, Kpi, PageHeader, ProgressBar, SectionLabel, BeltTag, StatusBadge } from "@/components/dashboard/primitives";
import {
  SCHOOL, FINANCE_SUMMARY, REVENUE_12M, GRAD_CANDIDATES, NEXT_CEREMONY, ATTENDANCE_TODAY,
  nextSession, DAYS_FULL, gearLabel,
  MY_ATTENDANCE, MY_GRADUATION, MY_INVOICES, CURRENT_STUDENT, brl,
} from "@/lib/data";
import { BELTS, nextBelt } from "@/lib/belts";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — X BJJ School" }] }),
  component: Home,
});

function Home() {
  const { isStaff } = useAuth();
  return isStaff ? <AdminHome /> : <StudentHome />;
}

// ——————————————————————— ADMIN / MESTRE ———————————————————————
function AdminHome() {
  const { role } = useAuth();
  // Financeiro é exclusivo do Mestre — o ADM vê a Visão Geral sem finanças.
  const showFinance = role === "mestre";

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="PAINEL EXECUTIVO" title="Visão Geral" />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Alunos Ativos" value={SCHOOL.stats.activeStudents} hint={<span className="inline-flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />+8 no mês</span>} />
        <Kpi label="Retenção Mensal" value={`${SCHOOL.stats.monthlyRetention}%`} hint="média dos últimos 6 meses" />
        {showFinance ? (
          <>
            <Kpi label="Receita Mensal" value={brl(FINANCE_SUMMARY.monthlyRevenue)} hint={<span className="inline-flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />+{FINANCE_SUMMARY.revenueDeltaPct}% vs mês passado</span>} />
            <Kpi label="Inadimplência" value={`${FINANCE_SUMMARY.defaultRate}%`} hint={`${FINANCE_SUMMARY.pendingCount} mensalidades pendentes`} />
          </>
        ) : (
          <>
            <Kpi label="Presença Hoje" value={`${ATTENDANCE_TODAY.present}/${ATTENDANCE_TODAY.expected}`} hint={`${ATTENDANCE_TODAY.rate}% de comparecimento`} />
            <Kpi label="Graduações" value={GRAD_CANDIDATES.length} hint="candidatos à próxima cerimônia" />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {showFinance ? (
          <Card className="lg:col-span-2">
            <div className="flex items-end justify-between">
              <div>
                <Eyebrow>CRESCIMENTO</Eyebrow>
                <h2 className="text-display mt-2 text-xl">Receita · 12 meses</h2>
              </div>
              <div className="text-display text-3xl">+89%</div>
            </div>
            <RevenueChart />
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <Eyebrow>PRESENÇA HOJE</Eyebrow>
            <div className="text-display mt-2 text-6xl">
              {ATTENDANCE_TODAY.present}
              <span className="text-3xl text-muted-foreground">/{ATTENDANCE_TODAY.expected}</span>
            </div>
            <ProgressBar value={ATTENDANCE_TODAY.rate} className="mt-6" />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{ATTENDANCE_TODAY.rate}% de comparecimento hoje</span>
              <Link to="/dashboard/presenca" className="hover:text-foreground">Ver presença →</Link>
            </div>
          </Card>
        )}

        <Card>
          <Eyebrow>PRÓXIMAS GRADUAÇÕES</Eyebrow>
          <h2 className="text-display mt-2 text-xl">{new Date(NEXT_CEREMONY.date).toLocaleDateString("pt-BR")}</h2>
          <ul className="mt-5 divide-y divide-border">
            {GRAD_CANDIDATES.slice(0, 4).map((g) => (
              <li key={g.studentName} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm">{g.studentName}</div>
                  <div className="text-xs text-muted-foreground">
                    {g.kind === "faixa" ? `${BELTS[g.from].label} → ${BELTS[g.to].label}` : `${BELTS[g.to].label} · +1 grau`}
                  </div>
                </div>
                <BeltTag belt={g.to} showLabel={false} />
              </li>
            ))}
          </ul>
          <Link to="/dashboard/graduacoes" className="text-display mt-4 inline-block text-xs text-muted-foreground hover:text-foreground">
            Ver todas →
          </Link>
        </Card>
      </div>

      {showFinance ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Eyebrow>PRESENÇA HOJE</Eyebrow>
            <div className="text-display mt-2 text-5xl">
              {ATTENDANCE_TODAY.present}
              <span className="text-2xl text-muted-foreground">/{ATTENDANCE_TODAY.expected}</span>
            </div>
            <ProgressBar value={ATTENDANCE_TODAY.rate} className="mt-4" />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{ATTENDANCE_TODAY.rate}% de comparecimento</span>
              <Link to="/dashboard/presenca" className="hover:text-foreground">Ver presença →</Link>
            </div>
          </Card>

          <Card>
            <Eyebrow>MENSALIDADES</Eyebrow>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-display text-5xl">{FINANCE_SUMMARY.pendingCount}</span>
              <span className="mb-1.5 text-sm text-muted-foreground">a receber · {brl(FINANCE_SUMMARY.pendingAmount)}</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {FINANCE_SUMMARY.paidThisMonth} mensalidades quitadas este mês
            </div>
            <Link to="/dashboard/financeiro" className="text-display mt-6 block w-full border border-border px-4 py-3 text-center text-xs transition hover:bg-accent">
              Abrir financeiro
            </Link>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function RevenueChart() {
  const max = Math.max(...REVENUE_12M.map((d) => d.value));
  return (
    <div className="mt-8 flex h-48 items-end gap-2">
      {REVENUE_12M.map((d) => (
        <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
          <div className="w-full bg-foreground/80 transition group-hover:bg-foreground" style={{ height: `${(d.value / max) * 100}%` }} />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ——————————————————————— ALUNO ———————————————————————
function StudentHome() {
  const next = nextSession();
  const pending = MY_INVOICES.find((i) => i.status !== "pago");
  const tgt = nextBelt(MY_GRADUATION.current.belt);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="MEU PAINEL" title={`Olá, ${CURRENT_STUDENT.name.split(" ")[0]}`} />

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
          ) : null}
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4" />
            <SectionLabel>Sequência</SectionLabel>
          </div>
          <div className="text-display mt-3 text-5xl">{MY_ATTENDANCE.streak}</div>
          <div className="mt-1 text-xs text-muted-foreground">aulas seguidas</div>
          <div className="mt-5 flex justify-between text-xs text-muted-foreground">
            <span>Este mês</span>
            <span>{MY_ATTENDANCE.thisMonth}/{MY_ATTENDANCE.monthGoal}</span>
          </div>
          <ProgressBar value={(MY_ATTENDANCE.thisMonth / MY_ATTENDANCE.monthGoal) * 100} className="mt-1" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <SectionLabel>Minha evolução</SectionLabel>
          </div>
          <div className="mt-4">
            <BeltTag belt={MY_GRADUATION.current.belt} stripes={MY_GRADUATION.current.stripes} />
          </div>
          <div className="mt-5 flex justify-between text-xs text-muted-foreground">
            <span>Próximo: {MY_GRADUATION.target.belt === MY_GRADUATION.current.belt ? `${MY_GRADUATION.target.stripes}º grau` : tgt?.label}</span>
            <span>{MY_GRADUATION.progress}%</span>
          </div>
          <ProgressBar value={MY_GRADUATION.progress} className="mt-1" />
          <Link to="/dashboard/graduacoes" className="text-display mt-5 inline-block text-xs text-muted-foreground hover:text-foreground">
            Ver checklist →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <SectionLabel>Mensalidade</SectionLabel>
          </div>
          {pending ? (
            <>
              <div className="text-display mt-3 text-3xl">{brl(pending.amount)}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{pending.ref} · vence {new Date(pending.dueDate).toLocaleDateString("pt-BR")}</span>
                <StatusBadge status={pending.status} />
              </div>
              <Link to="/dashboard/financeiro" className="text-display mt-6 block w-full bg-primary px-4 py-3 text-center text-xs text-primary-foreground transition hover:bg-primary/90">
                Pagar com Pix
              </Link>
            </>
          ) : (
            <div className="mt-3 text-sm text-muted-foreground">Tudo em dia ✓</div>
          )}
        </Card>
      </div>
    </div>
  );
}
