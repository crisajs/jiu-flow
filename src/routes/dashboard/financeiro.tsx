import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Kpi, PageHeader, SectionLabel, StatusBadge, Restricted, BeltTag } from "@/components/dashboard/primitives";
import { PixDialog } from "@/components/dashboard/PixDialog";
import { SCHOOL, brl, type Student } from "@/lib/data";
import { useStudents, useMonthPayments, useTogglePayment, useMyStudent, currentRef } from "@/lib/db/queries";

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

// ——————————————————————— MESTRE: pago / não pago do mês ———————————————————————
function AdmFinanceiro() {
  const ref = currentRef();
  const { data: students = [], isLoading } = useStudents();
  const { data: paid = new Set<string>() } = useMonthPayments(ref);
  const toggle = useTogglePayment(ref);
  const [q, setQ] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);

  const filtered = useMemo(
    () =>
      students.filter((s) => {
        const matchQ = s.name.toLowerCase().includes(q.toLowerCase());
        return matchQ && (!onlyPending || !paid.has(s.id));
      }),
    [students, q, onlyPending, paid],
  );

  const paidCount = students.filter((s) => paid.has(s.id)).length;
  const pendingCount = students.length - paidCount;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow={`MENSALIDADES · ${ref.toUpperCase()}`} title="Financeiro" />

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <Kpi label="Recebido" value={brl(paidCount * SCHOOL.monthlyFee)} hint={`${paidCount} de ${students.length} pagos`} />
        <Kpi label="A receber" value={brl(pendingCount * SCHOOL.monthlyFee)} hint={`${pendingCount} pendentes`} />
        <Kpi label="Mensalidade" value={brl(SCHOOL.monthlyFee)} hint="valor fixo por aluno" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 border border-border bg-background px-3 py-2.5 sm:max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={() => setOnlyPending((v) => !v)}
          className={`border px-3 py-2 text-xs transition ${
            onlyPending ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Só pendentes
        </button>
      </div>

      <div className="space-y-2">
        {isLoading ? <div className="py-10 text-center text-sm text-muted-foreground">Carregando…</div> : null}
        {filtered.map((s) => (
          <PaymentRow
            key={s.id}
            s={s}
            paid={paid.has(s.id)}
            onToggle={(next) => toggle.mutate({ studentId: s.id, paid: next })}
          />
        ))}
        {!isLoading && filtered.length === 0 ? (
          <div className="border border-border bg-card py-10 text-center text-sm text-muted-foreground">Nenhum aluno.</div>
        ) : null}
      </div>
    </div>
  );
}

function PaymentRow({ s, paid, onToggle }: { s: Student; paid: boolean; onToggle: (next: boolean) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border border-border bg-card p-4">
      <span className="text-display grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xs">{s.initials}</span>
      <div className="min-w-[9rem] flex-1">
        <div className="text-sm font-medium">{s.name}</div>
        <div className="text-xs text-muted-foreground">{s.category}</div>
      </div>
      <BeltTag belt={s.belt} stripes={s.stripes} size="sm" showLabel={false} />
      <span className="text-display text-sm">{brl(SCHOOL.monthlyFee)}</span>
      <StatusBadge status={paid ? "pago" : "pendente"} />
      <button
        onClick={() => onToggle(!paid)}
        className={`text-display inline-flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-wider transition ${
          paid
            ? "border border-border text-muted-foreground hover:bg-accent"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {paid ? "Desfazer" : <><Check className="h-3.5 w-3.5" /> Marcar pago</>}
      </button>
    </div>
  );
}

// ——————————————————————— ALUNO: minha mensalidade ———————————————————————
function AlunoFinanceiro() {
  const ref = currentRef();
  const { data: me } = useMyStudent();
  const { data: paid = new Set<string>() } = useMonthPayments(ref);
  const [pixOpen, setPixOpen] = useState(false);
  const isPaid = !!me && paid.has(me.id);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow={`MINHA MENSALIDADE · ${ref.toUpperCase()}`} title="Mensalidade" />

      <Card className="max-w-md">
        <SectionLabel>Valor mensal</SectionLabel>
        <div className="text-display mt-3 text-4xl">{brl(SCHOOL.monthlyFee)}</div>
        <div className="mt-4"><StatusBadge status={isPaid ? "pago" : "pendente"} /></div>

        {isPaid ? (
          <p className="mt-5 text-sm text-muted-foreground">Mensalidade deste mês quitada. Bons treinos! 🥋</p>
        ) : (
          <>
            <button
              onClick={() => setPixOpen(true)}
              className="text-display mt-6 w-full bg-primary px-6 py-3 text-xs text-primary-foreground transition hover:bg-primary/90"
            >
              Pagar via Pix
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Após o pagamento, o professor confirma no sistema.
            </p>
          </>
        )}
      </Card>

      {pixOpen ? <PixDialog onClose={() => setPixOpen(false)} /> : null}
    </div>
  );
}
