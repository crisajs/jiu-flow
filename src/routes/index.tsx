import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { XLogo } from "@/components/XLogo";
import { ArrowRight, Activity, Users, Trophy, Calendar, Wallet, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "X Brazilian Jiu-Jitsu School" },
      { name: "description", content: "Centro de treinamento de Jiu-Jitsu. Disciplina, evolução e comunidade." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grain opacity-60" />
        <div className="pointer-events-none absolute -right-32 -top-32 select-none opacity-[0.04]">
          <XLogo className="h-[640px] w-[640px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="mb-6 inline-flex items-center gap-2 border border-border px-3 py-1.5 text-[10px] tracking-[0.3em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              CENTRO DE TREINAMENTO · DESDE A FAIXA BRANCA
            </div>

            <h1 className="text-display text-[14vw] leading-[0.85] sm:text-[10vw] lg:text-[8.5rem]">
              Disciplina.<br />
              Evolução.<br />
              <span className="text-muted-foreground">Performance.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              X Brazilian Jiu-Jitsu School — uma plataforma e um método que acompanham
              cada atleta da primeira aula experimental até a faixa-preta.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/agendar"
                className="text-display group inline-flex items-center gap-3 bg-primary px-6 py-4 text-sm text-primary-foreground transition hover:bg-primary/90"
              >
                Aula Experimental Gratuita
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/dashboard"
                className="text-display inline-flex items-center gap-3 border border-border bg-card px-6 py-4 text-sm transition hover:bg-accent"
              >
                Acessar Plataforma
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
              {[
                { k: "120+", v: "Atletas ativos" },
                { k: "06", v: "Faixas-preta" },
                { k: "98%", v: "Retenção mensal" },
                { k: "24/7", v: "Plataforma" },
              ].map((s) => (
                <div key={s.v} className="bg-card p-6">
                  <div className="text-display text-3xl">{s.k}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-border bg-card py-4">
        <div className="text-display flex animate-[marquee_30s_linear_infinite] gap-12 whitespace-nowrap text-2xl text-muted-foreground">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              GI · NO-GI · INFANTIL · FEMININO · COMPETIÇÃO · DEFESA PESSOAL · PRIVATIVA ·
            </span>
          ))}
        </div>
      </div>

      <section id="programa" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">01 / PROGRAMA</div>
              <h2 className="text-display mt-4 text-5xl sm:text-7xl">Tudo em um<br />único tatame digital.</h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Operação completa: do primeiro contato no Instagram à graduação de faixa-preta.
            </p>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Users, t: "CRM de Leads", d: "Captação, follow-up automático e funil até a matrícula." },
              { i: Calendar, t: "Cronograma", d: "Aulas Gi, No-Gi, infantil e privativa com integração Google/Apple." },
              { i: Activity, t: "Presença", d: "Reconhecimento facial, QR Code e ranking de frequência." },
              { i: Trophy, t: "Graduações", d: "Checklist técnico, histórico de faixas e graus." },
              { i: Wallet, t: "Financeiro", d: "Mensalidades, Pix, inadimplência e relatórios em tempo real." },
              { i: MessageCircle, t: "WhatsApp", d: "Boas-vindas, lembretes e cobranças totalmente automáticos." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="group relative bg-card p-8 transition hover:bg-accent">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
                <h3 className="text-display mt-6 text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">02 / MÉTODO</div>
          <h2 className="text-display mt-4 text-5xl sm:text-7xl">Da branca à preta.</h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-4">
            {[
              { n: "01", t: "Aula Experimental", d: "Primeiro contato. Avaliação física e técnica gratuita." },
              { n: "02", t: "Matrícula Digital", d: "Contrato, termos e assinatura digital em minutos." },
              { n: "03", t: "Treino Diário", d: "Presença registrada, evolução acompanhada por faixa." },
              { n: "04", t: "Graduação", d: "Checklist completo. Cerimônia. Próximo grau." },
            ].map((s) => (
              <div key={s.n} className="border-l border-border pl-6">
                <div className="text-display text-3xl text-muted-foreground">{s.n}</div>
                <h3 className="text-display mt-4 text-lg">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
          <XLogo className="mx-auto h-20 w-20" />
          <h2 className="text-display mx-auto mt-8 max-w-3xl text-5xl sm:text-7xl">
            O tatame está esperando.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Agende sua aula experimental gratuita. Sem compromisso. Apenas você, o kimono e o método.
          </p>
          <Link
            to="/agendar"
            className="text-display mt-10 inline-flex items-center gap-3 bg-primary px-8 py-5 text-sm text-primary-foreground transition hover:bg-primary/90"
          >
            Quero Treinar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <XLogo className="h-10 w-10" />
            <div>
              <div className="text-display text-sm">X Brazilian Jiu-Jitsu School</div>
              <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} — Todos os direitos reservados.</div>
            </div>
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Disciplina · Evolução · Comunidade
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
