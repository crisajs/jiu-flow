import { createFileRoute } from "@tanstack/react-router";
import { QrCode } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, Kpi, PageHeader, ProgressBar, SectionLabel } from "@/components/dashboard/primitives";
import { ATTENDANCE_TODAY, ATTENDANCE_BY_WEEKDAY, RECENT_CHECKINS, MY_ATTENDANCE } from "@/lib/data";

export const Route = createFileRoute("/dashboard/presenca")({
  head: () => ({ meta: [{ title: "Presença — X BJJ School" }] }),
  component: Presenca,
});

function Presenca() {
  const { isStaff } = useAuth();
  return isStaff ? <AdmPresenca /> : <AlunoPresenca />;
}

function AdmPresenca() {
  const max = Math.max(...ATTENDANCE_BY_WEEKDAY.map((d) => d.value));
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="FREQUÊNCIA" title="Presença" />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <Kpi label="Presentes hoje" value={`${ATTENDANCE_TODAY.present}/${ATTENDANCE_TODAY.expected}`} hint={`${ATTENDANCE_TODAY.rate}% de comparecimento`} />
        <Kpi label="Média semanal" value="74%" hint="últimas 4 semanas" />
        <Kpi label="Faltas críticas" value="6" hint="alunos com +10 dias ausentes" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Eyebrow>PRESENÇA MÉDIA POR DIA</Eyebrow>
          <div className="mt-8 flex h-48 items-end gap-3">
            {ATTENDANCE_BY_WEEKDAY.map((d) => (
              <div key={d.day} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{d.value}%</span>
                <div className="w-full bg-foreground/80 transition group-hover:bg-foreground" style={{ height: `${(d.value / max) * 100}%` }} />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Eyebrow>CHECK-INS AGORA</Eyebrow>
          <ul className="mt-5 divide-y divide-border">
            {RECENT_CHECKINS.map((c) => (
              <li key={c.name} className="flex items-center gap-3 py-3">
                <span className="text-display grid h-8 w-8 place-items-center rounded-full bg-accent text-xs">{c.initials}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{c.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{c.className}</div>
                </div>
                <span className="text-xs text-muted-foreground">{c.at}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

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
          <QrCode className="h-24 w-24" strokeWidth={1} />
          <SectionLabel>Check-in</SectionLabel>
          <p className="mt-2 max-w-[12rem] text-xs text-muted-foreground">
            Mostre seu QR Code na recepção para registrar presença.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <Eyebrow>HISTÓRICO RECENTE</Eyebrow>
          <ul className="mt-5 divide-y divide-border">
            {MY_ATTENDANCE.recent.map((d) => (
              <li key={d.date} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm">{d.className}</div>
                  <div className="text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })}</div>
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
