import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Plus, Search, X } from "lucide-react";
import { PageHeader, Restricted, BeltTag, StatusBadge } from "@/components/dashboard/primitives";
import { type Student } from "@/lib/data";
import { BELTS, ADULT_ORDER, KID_ORDER, type BeltId } from "@/lib/belts";
import { useStudents, useAddStudent } from "@/lib/db/queries";

// Ordem de exibição das faixas (adulto + infantil) para os filtros.
const BELT_ORDER: BeltId[] = ["branca", "cinza", "amarela", "laranja", "verde", "azul", "roxa", "marrom", "preta"];
const CATEGORIES = ["Adultos", "Juvenil", "Infantil"];

export const Route = createFileRoute("/dashboard/alunos")({
  head: () => ({ meta: [{ title: "Alunos — X BJJ School" }] }),
  component: () => (
    <Restricted allow={["mestre", "adm"]}>
      <Alunos />
    </Restricted>
  ),
});

function Alunos() {
  const { data: students = [], isLoading } = useStudents();
  const [q, setQ] = useState("");
  const [belt, setBelt] = useState<BeltId | "todas">("todas");
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(
    () =>
      students.filter((s) => {
        const matchQ = s.name.toLowerCase().includes(q.toLowerCase());
        const matchBelt = belt === "todas" || s.belt === belt;
        return matchQ && matchBelt;
      }),
    [students, q, belt],
  );

  const presentBelts = useMemo(() => BELT_ORDER.filter((b) => students.some((s) => s.belt === b)), [students]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="COMUNIDADE"
        title="Alunos"
        actions={
          <button
            onClick={() => setAdding(true)}
            className="text-display inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Matricular
          </button>
        }
      />

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
        <div className="flex flex-wrap gap-1">
          <FilterChip active={belt === "todas"} onClick={() => setBelt("todas")}>Todas</FilterChip>
          {presentBelts.map((b) => (
            <FilterChip key={b} active={belt === b} onClick={() => setBelt(b)}>
              {BELTS[b].label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {isLoading ? "Carregando…" : `${filtered.length} aluno${filtered.length === 1 ? "" : "s"}`}
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-3 py-3 font-normal sm:px-4">Aluno</th>
              <th className="hidden px-4 py-3 font-normal sm:table-cell">Matrícula</th>
              <th className="px-3 py-3 font-normal sm:px-4">Faixa</th>
              <th className="hidden px-4 py-3 font-normal md:table-cell">Turma</th>
              <th className="hidden px-4 py-3 font-normal md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 60).map((s) => (
              <Row key={s.id} s={s} />
            ))}
            {!isLoading && filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Nenhum aluno encontrado.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {filtered.length > 60 ? (
        <div className="text-center text-xs text-muted-foreground">Mostrando 60 de {filtered.length}</div>
      ) : null}

      {adding ? <AddStudentModal onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function Row({ s }: { s: Student }) {
  return (
    <tr className="border-b border-border transition hover:bg-card">
      <td className="px-3 py-3 sm:px-4">
        <div className="flex items-center gap-3">
          <span className="text-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-xs">{s.initials}</span>
          <div className="min-w-0">
            <div className="truncate font-medium">{s.name}</div>
            <div className="truncate text-xs text-muted-foreground">{s.whatsapp}</div>
            {/* no celular a matrícula/turma entram aqui (colunas ficam ocultas) */}
            <div className="text-display mt-1 text-[11px] tracking-[0.15em] text-muted-foreground sm:hidden">
              {s.enrollmentCode ?? "—"} · {s.category}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell"><span className="text-display tracking-[0.15em] text-muted-foreground">{s.enrollmentCode ?? "—"}</span></td>
      <td className="px-3 py-3 sm:px-4"><BeltTag belt={s.belt} stripes={s.stripes} showLabel={false} /></td>
      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{s.category}</td>
      <td className="hidden px-4 py-3 md:table-cell"><StatusBadge status={s.status} /></td>
    </tr>
  );
}

function AddStudentModal({ onClose }: { onClose: () => void }) {
  const add = useAddStudent();
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    category: "Adultos",
    belt: "branca" as BeltId,
    stripes: 0,
    age: "",
  });

  const beltOptions = form.category === "Adultos" ? ADULT_ORDER : KID_ORDER;

  function submit(e: FormEvent) {
    e.preventDefault();
    add.mutate(
      {
        name: form.name,
        whatsapp: form.whatsapp,
        age: form.age ? Number(form.age) : null,
        belt: form.belt,
        stripes: form.stripes,
        category: form.category,
      },
      { onSuccess: (code) => setSavedCode(code) },
    );
  }

  if (savedCode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
        <div className="w-full max-w-sm border border-border bg-card p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">MATRÍCULA CRIADA</div>
          <h2 className="text-display mt-3 text-2xl">{form.name.split(" ")[0]} matriculado ✓</h2>
          <p className="mt-4 text-sm text-muted-foreground">Entregue este código ao aluno — é a matrícula dele pra entrar no app:</p>
          <div className="text-display mt-4 select-all border border-border bg-background py-4 text-3xl tracking-[0.3em]">{savedCode}</div>
          <button onClick={onClose} className="text-display mt-6 w-full bg-primary px-6 py-3 text-xs text-primary-foreground transition hover:bg-primary/90">
            Concluir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/60 p-4 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-lg border border-border bg-card p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">NOVA MATRÍCULA</div>
            <h2 className="text-display mt-1 text-2xl">Matricular aluno</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Nome completo">
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="WhatsApp">
              <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} placeholder="(11) 90000-0000" className={inputCls} />
            </Field>
            <Field label="Idade">
              <input type="number" min={3} max={99} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Turma">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, belt: e.target.value === "Adultos" ? "branca" : f.belt }))}
                className={inputCls}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Graus">
              <select value={form.stripes} onChange={(e) => setForm((f) => ({ ...f, stripes: Number(e.target.value) }))} className={inputCls}>
                {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} grau{n === 1 ? "" : "s"}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Faixa">
            <select value={form.belt} onChange={(e) => setForm((f) => ({ ...f, belt: e.target.value as BeltId }))} className={inputCls}>
              {beltOptions.map((b) => <option key={b} value={b}>{BELTS[b].label}</option>)}
            </select>
          </Field>

          {add.isError ? <div className="text-xs text-red-400">Erro ao salvar. Tente de novo.</div> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="text-display border border-border px-5 py-3 text-xs transition hover:bg-accent">
              Cancelar
            </button>
            <button type="submit" disabled={add.isPending} className="text-display bg-primary px-5 py-3 text-xs text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
              {add.isPending ? "Salvando…" : "Matricular"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-2 text-xs transition ${active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
