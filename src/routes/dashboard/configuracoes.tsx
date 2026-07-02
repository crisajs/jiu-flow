import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Card, Eyebrow, PageHeader, SectionLabel, BeltTag } from "@/components/dashboard/primitives";
import { SCHOOL, CURRENT_STUDENT, PROFESSORS } from "@/lib/data";
import { beltLabel } from "@/lib/belts";

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
          <button className="text-display mt-5 w-full border border-border px-4 py-3 text-xs transition hover:bg-accent">
            Adicionar professor
          </button>
        </Card>

        <Card className="lg:col-span-2">
          <Eyebrow>PLANOS & MENSALIDADES</Eyebrow>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["Mensal", "R$ 249"],
              ["Trimestral", "R$ 219/mês"],
              ["Anual", "R$ 199/mês"],
            ].map(([n, v]) => (
              <div key={n} className="border border-border bg-background p-5">
                <div className="text-display text-lg">{v}</div>
                <div className="mt-1 text-xs text-muted-foreground">Plano {n}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AlunoPerfil() {
  const s = CURRENT_STUDENT;
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
            <Readonly label="Plano" value={s.plan} />
            <Readonly label="Idade" value={s.age != null ? `${s.age} anos` : "—"} />
          </div>
          <button className="text-display mt-6 border border-border px-5 py-3 text-xs transition hover:bg-accent">
            Editar dados
          </button>
        </Card>
      </div>
    </div>
  );
}
