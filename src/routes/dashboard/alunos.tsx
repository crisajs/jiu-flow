import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader, Restricted, BeltTag, StatusBadge } from "@/components/dashboard/primitives";
import { STUDENTS, type Student } from "@/lib/data";
import { BELTS, type BeltId } from "@/lib/belts";

// Ordem de exibição das faixas (adulto + infantil) para os filtros.
const BELT_ORDER: BeltId[] = ["branca", "cinza", "amarela", "laranja", "verde", "azul", "roxa", "marrom", "preta"];

export const Route = createFileRoute("/dashboard/alunos")({
  head: () => ({ meta: [{ title: "Alunos — X BJJ School" }] }),
  component: () => (
    <Restricted allow={["mestre", "adm"]}>
      <Alunos />
    </Restricted>
  ),
});

function Alunos() {
  const [q, setQ] = useState("");
  const [belt, setBelt] = useState<BeltId | "todas">("todas");

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      const matchQ = s.name.toLowerCase().includes(q.toLowerCase());
      const matchBelt = belt === "todas" || s.belt === belt;
      return matchQ && matchBelt;
    });
  }, [q, belt]);

  const presentBelts = useMemo(() => BELT_ORDER.filter((b) => STUDENTS.some((s) => s.belt === b)), []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="COMUNIDADE"
        title="Alunos"
        actions={
          <button className="text-display inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90">
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

      <div className="text-xs text-muted-foreground">{filtered.length} alunos</div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-4 py-3 font-normal">Aluno</th>
              <th className="px-4 py-3 font-normal">Faixa</th>
              <th className="px-4 py-3 font-normal">Turma</th>
              <th className="px-4 py-3 font-normal">Plano</th>
              <th className="px-4 py-3 font-normal">Início</th>
              <th className="px-4 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 40).map((s) => (
              <Row key={s.id} s={s} />
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > 40 ? (
        <div className="text-center text-xs text-muted-foreground">Mostrando 40 de {filtered.length}</div>
      ) : null}
    </div>
  );
}

function Row({ s }: { s: Student }) {
  return (
    <tr className="border-b border-border transition hover:bg-card">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-xs">{s.initials}</span>
          <div>
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.whatsapp}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><BeltTag belt={s.belt} stripes={s.stripes} /></td>
      <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
      <td className="px-4 py-3 text-muted-foreground">{s.plan}</td>
      <td className="px-4 py-3 text-muted-foreground">{s.joinedAt ? new Date(s.joinedAt + "T00:00").toLocaleDateString("pt-BR") : "—"}</td>
      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
    </tr>
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
