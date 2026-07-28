import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, PageHeader, SectionLabel, BeltTag } from "@/components/dashboard/primitives";
import { BELTS, beltLabel, type BeltId } from "@/lib/belts";
import { type Student } from "@/lib/data";
import { useStudents, useMyStudent, useUpdateBelt } from "@/lib/db/queries";

const BELT_ORDER: BeltId[] = ["branca", "cinza", "amarela", "laranja", "verde", "azul", "roxa", "marrom", "preta"];

export const Route = createFileRoute("/dashboard/graduacoes")({
  head: () => ({ meta: [{ title: "Faixas — X BJJ School" }] }),
  component: Graduacoes,
});

function Graduacoes() {
  const { isStaff } = useAuth();
  return isStaff ? <FaixasStaff /> : <MinhaFaixa />;
}

// ——————————————————————— GESTOR: edita faixa de todos ———————————————————————
function FaixasStaff() {
  const { data: students = [], isLoading } = useStudents();
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => students.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())),
    [students, q],
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="GRADUAÇÃO" title="Faixas" />

      <div className="flex items-center gap-2 border border-border bg-background px-3 py-2.5 sm:max-w-xs">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar aluno..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="text-xs text-muted-foreground">
        {isLoading ? "Carregando…" : "Toque em editar para graduar — a mudança vale na hora."}
      </div>

      <div className="space-y-2">
        {filtered.slice(0, 60).map((s) => (
          <BeltRow key={s.id} s={s} />
        ))}
        {!isLoading && filtered.length === 0 ? (
          <div className="border border-border bg-card py-10 text-center text-sm text-muted-foreground">Nenhum aluno.</div>
        ) : null}
      </div>
    </div>
  );
}

function BeltRow({ s }: { s: Student }) {
  const update = useUpdateBelt();
  const [editing, setEditing] = useState(false);
  const [belt, setBelt] = useState<BeltId>(s.belt);
  const [stripes, setStripes] = useState(s.stripes);

  function save() {
    update.mutate({ id: s.id, belt, stripes }, { onSuccess: () => setEditing(false) });
  }
  function cancel() {
    setBelt(s.belt);
    setStripes(s.stripes);
    setEditing(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border border-border bg-card p-3 sm:gap-4 sm:p-4">
      <span className="text-display grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xs">{s.initials}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{s.name}</div>
        <div className="text-xs text-muted-foreground">{s.category}</div>
      </div>

      {editing ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <select value={belt} onChange={(e) => setBelt(e.target.value as BeltId)} className="border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground">
            {BELT_ORDER.map((b) => <option key={b} value={b}>{BELTS[b].label}</option>)}
          </select>
          <select value={stripes} onChange={(e) => setStripes(Number(e.target.value))} className="border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground">
            {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}º</option>)}
          </select>
          <button onClick={save} disabled={update.isPending} className="inline-flex items-center gap-1 bg-primary px-3 py-2 text-xs text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60" aria-label="Salvar">
            <Check className="h-4 w-4" /> {update.isPending ? "…" : "Salvar"}
          </button>
          <button onClick={cancel} className="text-muted-foreground hover:text-foreground" aria-label="Cancelar">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <BeltTag belt={s.belt} stripes={s.stripes} showLabel={false} />
          <button onClick={() => setEditing(true)} className="text-display ml-auto inline-flex items-center gap-1.5 border border-border px-4 py-2 text-[10px] uppercase tracking-wider transition hover:bg-accent">
            <Pencil className="h-3.5 w-3.5" /> Editar
          </button>
        </>
      )}
    </div>
  );
}

// ——————————————————————— ALUNO: minha faixa ———————————————————————
function MinhaFaixa() {
  const { data: student, isLoading } = useMyStudent();
  const { user } = useAuth();

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }

  if (!student) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <PageHeader eyebrow="MEU CAMINHO" title="Minha Faixa" />
        <Card className="text-center text-sm text-muted-foreground">
          Sua matrícula ainda não está vinculada. Fale com a recepção.
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="MEU CAMINHO" title="Minha Faixa" />

      <Card className="flex flex-col items-center py-12 text-center">
        <SectionLabel>{user?.name}</SectionLabel>
        <div className="mt-6 scale-150">
          <BeltTag belt={student.belt} stripes={student.stripes} size="lg" showLabel={false} />
        </div>
        <div className="text-display mt-10 text-3xl">{beltLabel(student.belt, student.stripes)}</div>
        <p className="mt-3 max-w-xs text-xs text-muted-foreground">
          Sua graduação é atualizada pelo professor. Bons treinos! 🥋
        </p>
      </Card>
    </div>
  );
}
