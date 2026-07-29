import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, PageHeader, SectionLabel, BeltTag } from "@/components/dashboard/primitives";
import { SCHOOL, PROFESSORS, brl, type Student } from "@/lib/data";
import { beltLabel, nextBelt } from "@/lib/belts";
import { useMyStudent, useSetMyBelt } from "@/lib/db/queries";

export const Route = createFileRoute("/dashboard/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — X BJJ School" }] }),
  component: Configuracoes,
});

function Configuracoes() {
  const { isStaff } = useAuth();
  return isStaff ? <AdmConfig /> : <AlunoPerfil />;
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm">{value}</div>
    </label>
  );
}

function AdmConfig() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="ADMINISTRAÇÃO" title="Configurações" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Eyebrow>DADOS DA ESCOLA</Eyebrow>
          <div className="mt-5 space-y-4">
            <Readonly label="Nome" value={SCHOOL.name} />
            <Readonly label="Cidade" value={SCHOOL.city} />
            <Readonly label="Fundação" value={`${SCHOOL.foundedYear} · 2 anos de tatame`} />
          </div>
        </Card>

        <Card>
          <Eyebrow>EQUIPE TÉCNICA</Eyebrow>
          <ul className="mt-5 divide-y divide-border">
            {PROFESSORS.map((p) => (
              <li key={p} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-display grid h-8 w-8 place-items-center rounded-full bg-accent text-xs">
                    {p.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <span className="text-sm">{p}</span>
                </div>
                <BeltTag belt="preta" showLabel={false} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <Eyebrow>MENSALIDADE</Eyebrow>
          <div className="text-display mt-4 text-4xl">
            {brl(SCHOOL.monthlyFee)}<span className="text-lg text-muted-foreground">/mês</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Valor único para todos os alunos. Pagamento via Pix.</p>
        </Card>
      </div>
    </div>
  );
}

function AlunoPerfil() {
  const { data: s, isLoading } = useMyStudent();

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  if (!s) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <PageHeader eyebrow="MINHA CONTA" title="Meu Perfil" />
        <Card className="text-center text-sm text-muted-foreground">Matrícula ainda não vinculada. Fale com a recepção.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="MINHA CONTA" title="Meu Perfil" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center">
          <span className="text-display grid h-20 w-20 place-items-center rounded-full bg-accent text-2xl">{s.initials}</span>
          <h2 className="text-display mt-4 text-xl">{s.name}</h2>
          <div className="mt-3"><BeltTag belt={s.belt} stripes={s.stripes} /></div>
          <div className="mt-2 text-xs text-muted-foreground">Aluno desde {s.joinedAt ? new Date(s.joinedAt + "T00:00").toLocaleDateString("pt-BR") : "—"}</div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionLabel>Dados cadastrais</SectionLabel>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Readonly label="Nome completo" value={s.name} />
            <Readonly label="Faixa" value={beltLabel(s.belt, s.stripes)} />
            <Readonly label="WhatsApp" value={s.whatsapp} />
            <Readonly label="Turma" value={s.category} />
          </div>
        </Card>
      </div>

      <BeltSelfEditor s={s} />
    </div>
  );
}

// Aluno atualiza a própria graduação — só progressão condizente (validado no banco).
function BeltSelfEditor({ s }: { s: Student }) {
  const setBelt = useSetMyBelt();
  const nxt = nextBelt(s.belt);
  const [stripes, setStripes] = useState(s.stripes);

  return (
    <Card>
      <Eyebrow>MINHA GRADUAÇÃO</Eyebrow>
      <div className="mt-4 flex items-center gap-4">
        <BeltTag belt={s.belt} stripes={s.stripes} size="lg" showLabel={false} />
        <span className="text-display text-xl">{beltLabel(s.belt, s.stripes)}</span>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Graus</span>
          <select value={stripes} onChange={(e) => setStripes(Number(e.target.value))} className="mt-1.5 block border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground">
            {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} grau{n === 1 ? "" : "s"}</option>)}
          </select>
        </label>
        <button
          onClick={() => setBelt.mutate({ belt: s.belt, stripes })}
          disabled={setBelt.isPending || stripes === s.stripes}
          className="text-display bg-primary px-5 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          Atualizar graus
        </button>
        {nxt ? (
          <button
            onClick={() => setBelt.mutate({ belt: nxt.id, stripes: 0 })}
            disabled={setBelt.isPending}
            className="text-display border border-border px-5 py-2.5 text-xs transition hover:bg-accent disabled:opacity-50"
          >
            Avançar para {nxt.label}
          </button>
        ) : null}
      </div>

      {setBelt.isError ? <div className="mt-3 text-xs text-red-400">{(setBelt.error as Error).message}</div> : null}
      <p className="mt-3 text-[11px] text-muted-foreground">
        Só é possível ajustar graus ou avançar para a próxima faixa — nada de pular etapas.
      </p>
    </Card>
  );
}
