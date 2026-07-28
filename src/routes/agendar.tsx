import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { SCHOOL, SCHEDULE, DAYS } from "@/lib/data";

// Opções derivadas da grade oficial (mantém a aula experimental sempre em sincronia).
const TURMAS = [...new Set(SCHEDULE.map((s) => s.title))];
const HORARIOS = [...new Set(SCHEDULE.map((s) => s.start))].sort();
const fmtHora = (h: string) => h.replace(":", "h");

// Resumo por turma: dias + horários (para o visitante saber quando vir).
const GRADE_RESUMO = TURMAS.map((title) => {
  const aulas = SCHEDULE.filter((s) => s.title === title);
  const dias = [...new Set(aulas.map((s) => s.day))].sort().map((d) => DAYS[d]);
  const horas = [...new Set(aulas.map((s) => s.start))].sort().map(fmtHora);
  return { title, dias, horas };
});

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agende sua Aula Experimental — X BJJ School" },
      { name: "description", content: "Aula experimental gratuita de Jiu-Jitsu. Escolha data, horário e professor." },
    ],
  }),
  component: Agendar,
});

function Agendar() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">AULA EXPERIMENTAL</div>
          <h1 className="text-display mt-4 text-5xl leading-[0.9] sm:text-6xl">
            Sua primeira<br className="hidden sm:inline" /> aula é por nossa<br className="hidden sm:inline" /> conta.
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Preencha o formulário. Em seguida você recebe confirmação no WhatsApp e
            um convite para o calendário (Google, Apple ou Outlook).
          </p>

          <ul className="mt-10 space-y-3 text-sm">
            {["Professor faixa-preta multimedalista acompanha a aula", "Avaliação técnica e física gratuita"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-foreground" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-border pt-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Grade de aulas</div>
            <ul className="mt-4 space-y-3">
              {GRADE_RESUMO.map((g) => (
                <li key={g.title} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-sm">{g.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {g.dias.join(" · ")} — {g.horas.join(" / ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Prefere falar direto?</div>
            <a
              href={`https://wa.me/${SCHOOL.phoneDigits}`}
              target="_blank"
              rel="noreferrer"
              className="text-display mt-3 inline-flex items-center gap-2 border border-border px-5 py-3 text-sm transition hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4" /> {SCHOOL.phone}
            </a>
            <p className="mt-3 text-xs text-muted-foreground">{SCHOOL.address}</p>
          </div>
        </div>

        <div className="border border-border bg-card p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12" strokeWidth={1.5} />
              <h2 className="text-display mt-6 text-2xl">Aula agendada!</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Você receberá uma confirmação no WhatsApp em instantes com o link do calendário.
              </p>
              <Link to="/" className="text-display mt-8 inline-flex items-center gap-2 border border-border px-5 py-3 text-xs">
                Voltar ao início <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <Field label="Nome completo" name="nome" />
              <Field label="WhatsApp" name="whatsapp" placeholder="(00) 00000-0000" />
              <Field label="E-mail" name="email" type="email" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Idade" name="idade" type="number" />
                <Select label="Já treinou?" name="experiencia" options={["Nunca", "Sim, branca", "Outra graduação"]} />
              </div>
              <Select label="Turma" name="turma" options={TURMAS} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data" name="data" type="date" />
                <Select label="Horário" name="horario" options={HORARIOS.map(fmtHora)} />
              </div>

              <button
                type="submit"
                className="text-display mt-2 flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm text-primary-foreground transition hover:bg-primary/90"
              >
                Confirmar Aula
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-foreground"
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <select
        required
        name={name}
        className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-foreground"
      >
        <option value="">Selecione...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
