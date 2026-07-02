import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, Kpi, PageHeader, SectionLabel, StatusBadge, Restricted } from "@/components/dashboard/primitives";
import { PixDialog } from "@/components/dashboard/PixDialog";
import { FINANCE_SUMMARY, REVENUE_12M, MY_INVOICES, STUDENTS, brl, type Invoice } from "@/lib/data";

export const Route = createFileRoute("/dashboard/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — X BJJ School" }] }),
  component: Financeiro,
});

function Financeiro() {
  const { role } = useAuth();
  // Financeiro agregado é EXCLUSIVO do Mestre. ADM não acessa. Aluno vê a própria mensalidade.
  if (role === "aluno") return <AlunoFinanceiro />;
  return (
    <Restricted allow={["mestre"]}>
      <AdmFinanceiro />
    </Restricted>
  );
}

function AdmFinanceiro() {
  const max = Math.max(...REVENUE_12M.map((d) => d.value));
  const inadimplentes = STUDENTS.filter((s) => s.status === "inadimplente").slice(0, 8);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="FINANCEIRO"
        title="Receita & Mensalidades"
        actions={
          <button className="text-display border border-border px-4 py-2.5 text-xs transition hover:bg-accent">
            Exportar
          </button>
        }
      />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Receita do mês" value={brl(FINANCE_SUMMARY.monthlyRevenue)} hint={`+${FINANCE_SUMMARY.revenueDeltaPct}% vs mês passado`} />
        <Kpi label="Inadimplência" value={`${FINANCE_SUMMARY.defaultRate}%`} hint={brl(FINANCE_SUMMARY.pendingAmount) + " em aberto"} />
        <Kpi label="Pagas no mês" value={FINANCE_SUMMARY.paidThisMonth} hint="mensalidades quitadas" />
        <Kpi label="Pendentes" value={FINANCE_SUMMARY.pendingCount} hint="mensalidades a receber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Eyebrow>RECEITA · 12 MESES</Eyebrow>
          <div className="mt-8 flex h-48 items-end gap-2">
            {REVENUE_12M.map((d) => (
              <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
                <div className="w-full bg-foreground/80 transition group-hover:bg-foreground" style={{ height: `${(d.value / max) * 100}%` }} />
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Eyebrow>INADIMPLENTES</Eyebrow>
          <ul className="mt-5 divide-y divide-border">
            {inadimplentes.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{brl(s.monthlyFee)} · {s.plan}</div>
                </div>
                <button className="text-display border border-border px-2.5 py-1.5 text-[10px] uppercase tracking-wider transition hover:bg-accent">
                  Cobrar
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function AlunoFinanceiro() {
  const [pixOpen, setPixOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="MINHA MENSALIDADE" title="Mensalidade" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {MY_INVOICES.map((inv) => (
            <InvoiceRow key={inv.id} inv={inv} onPay={() => setPixOpen(true)} />
          ))}
        </div>

        <Card className="h-fit">
          <SectionLabel>Plano atual</SectionLabel>
          <div className="text-display mt-3 text-3xl">{brl(60)}<span className="text-sm text-muted-foreground">/mês</span></div>
          <div className="mt-1 text-xs text-muted-foreground">Plano Mensal</div>
          <button
            onClick={() => setPixOpen(true)}
            className="text-display mt-5 w-full bg-primary px-4 py-3 text-center text-xs text-primary-foreground transition hover:bg-primary/90"
          >
            Pagar via Pix
          </button>
          <div className="mt-5 border-t border-border pt-5 text-xs text-muted-foreground">
            O Pix tem <span className="text-foreground">valor aberto</span> — digite o valor da mensalidade no app do banco.
          </div>
        </Card>
      </div>

      {pixOpen ? <PixDialog onClose={() => setPixOpen(false)} /> : null}
    </div>
  );
}

function InvoiceRow({ inv, onPay }: { inv: Invoice; onPay: () => void }) {
  const open = inv.status !== "pago";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-4">
      <div>
        <div className="text-display text-lg">{inv.ref}</div>
        <div className="text-xs text-muted-foreground">
          Vencimento {new Date(inv.dueDate + "T00:00").toLocaleDateString("pt-BR")}
          {inv.method ? ` · ${inv.method}` : ""}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-display text-lg">{brl(inv.amount)}</span>
        <StatusBadge status={inv.status} />
        {open ? (
          <button
            onClick={onPay}
            className="text-display bg-primary px-4 py-2 text-xs text-primary-foreground transition hover:bg-primary/90"
          >
            Pagar Pix
          </button>
        ) : null}
      </div>
    </div>
  );
}
