import { createFileRoute, Link } from "@tanstack/react-router";
import { XLogo } from "@/components/XLogo";
import {
  LayoutDashboard, Users, UserPlus, Calendar, Activity, Trophy,
  Wallet, MessageCircle, BookOpen, Award, BarChart3, Settings, ArrowUpRight, ArrowDownRight
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — X BJJ School" }] }),
  component: Dashboard,
});

const nav = [
  { i: LayoutDashboard, t: "Dashboard", active: true },
  { i: UserPlus, t: "CRM / Leads" },
  { i: Users, t: "Alunos" },
  { i: Calendar, t: "Cronograma" },
  { i: Activity, t: "Presença" },
  { i: Trophy, t: "Graduações" },
  { i: Wallet, t: "Financeiro" },
  { i: MessageCircle, t: "WhatsApp" },
  { i: Award, t: "Eventos" },
  { i: BookOpen, t: "Biblioteca" },
  { i: BarChart3, t: "Relatórios" },
  { i: Settings, t: "Configurações" },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <Link to="/" className="flex items-center gap-3 border-b border-sidebar-border p-5">
          <XLogo className="h-9 w-9" />
          <div className="leading-none">
            <div className="text-display text-xs">X BJJ School</div>
            <div className="mt-1 text-[9px] tracking-[0.25em] text-muted-foreground">ADMIN</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-0.5 p-3">
          {nav.map(({ i: Icon, t, active }) => (
            <button
              key={t}
              className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition ${
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {t}
            </button>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          v1.0 · Plataforma X
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">PAINEL EXECUTIVO</div>
            <h1 className="text-display mt-1 text-2xl">Visão Geral</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-xs text-muted-foreground">Sensei</div>
              <div className="text-sm font-medium">Mestre X</div>
            </div>
            <div className="text-display grid h-10 w-10 place-items-center rounded-full bg-accent text-sm">M</div>
          </div>
        </header>

        <div className="space-y-6 p-6">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Alunos Ativos" value="124" delta="+8" up />
            <Kpi label="Receita Mensal" value="R$ 38.420" delta="+12%" up />
            <Kpi label="Inadimplência" value="4.2%" delta="-1.1%" up />
            <Kpi label="Taxa Conversão" value="68%" delta="+5%" up />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-border bg-card p-6 lg:col-span-2">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.3em] text-muted-foreground">CRESCIMENTO</div>
                  <h2 className="text-display mt-2 text-xl">Alunos ativos · 12 meses</h2>
                </div>
                <div className="text-display text-3xl">+34%</div>
              </div>
              <FakeChart />
            </div>

            <div className="border border-border bg-card p-6">
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">PRÓXIMAS GRADUAÇÕES</div>
              <h2 className="text-display mt-2 text-xl">Cerimônia · 28/06</h2>
              <ul className="mt-5 divide-y divide-border">
                {[
                  ["João Pereira", "Branca → Azul"],
                  ["Marina Costa", "Azul → Roxa"],
                  ["Rafael Lima", "Roxa → Marrom"],
                  ["Bianca Souza", "Branca → Azul"],
                ].map(([n, g]) => (
                  <li key={n} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm">{n}</div>
                      <div className="text-xs text-muted-foreground">{g}</div>
                    </div>
                    <BeltDot stage={g.includes("Azul") ? "azul" : g.includes("Roxa") ? "roxa" : "marrom"} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-border bg-card p-6">
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">PRESENÇA HOJE</div>
              <div className="text-display mt-2 text-5xl">87<span className="text-2xl text-muted-foreground">/124</span></div>
              <div className="mt-4 h-2 w-full overflow-hidden bg-muted">
                <div className="h-full bg-foreground" style={{ width: "70%" }} />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">70% de comparecimento — média semanal</div>
            </div>

            <div className="border border-border bg-card p-6">
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">LEADS · ESTA SEMANA</div>
              <div className="mt-4 space-y-3">
                {[
                  ["Novos", 14], ["Aula agendada", 9], ["Compareceu", 7], ["Matriculado", 5],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="flex justify-between text-sm"><span>{k}</span><span className="text-muted-foreground">{v}</span></div>
                    <div className="mt-1 h-1 w-full bg-muted"><div className="h-full bg-foreground" style={{ width: `${(v as number) * 7}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">PRÓXIMO EVENTO</div>
              <h3 className="text-display mt-2 text-xl">Open Interno · Verão</h3>
              <p className="mt-2 text-sm text-muted-foreground">15 de julho · 09:00<br />42 atletas inscritos</p>
              <button className="text-display mt-6 w-full border border-border px-4 py-3 text-xs transition hover:bg-accent">
                Gerenciar Evento
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Kpi({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="text-display mt-3 text-3xl">{value}</div>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {delta} vs mês passado
      </div>
    </div>
  );
}

function FakeChart() {
  const data = [42, 48, 55, 51, 60, 68, 72, 78, 85, 92, 108, 124];
  const max = Math.max(...data);
  return (
    <div className="mt-8 flex h-48 items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full bg-foreground/80 transition group-hover:bg-foreground"
            style={{ height: `${(v / max) * 100}%` }}
          />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
          </span>
        </div>
      ))}
    </div>
  );
}

function BeltDot({ stage }: { stage: string }) {
  const map: Record<string, string> = {
    azul: "bg-blue-500",
    roxa: "bg-purple-500",
    marrom: "bg-amber-700",
  };
  return <span className={`h-2 w-8 ${map[stage] ?? "bg-foreground"}`} />;
}
