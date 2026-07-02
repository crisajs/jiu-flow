import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { XLogo } from "@/components/XLogo";
import { ArrowRight, Shirt, Wind, Baby, Heart, Trophy, User, MapPin, Navigation, MessageCircle, Medal } from "lucide-react";
import { SCHOOL } from "@/lib/data";
import mestreEduardo from "@/assets/mestre du.jpeg";

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
              CENTRO DE TREINAMENTO · TABOÃO DA SERRA · DESDE 2024
            </div>

            <h1 className="text-display text-[14vw] leading-[0.85] sm:text-[10vw] lg:text-[8.5rem]">
              Disciplina.<br />
              Evolução.<br />
              <span className="text-muted-foreground">Performance.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              Há 2 anos formando atletas em Taboão da Serra. Do primeiro dia de kimono à
              evolução de cada faixa — disciplina, técnica e comunidade no mesmo tatame.
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
                to="/entrar"
                className="text-display inline-flex items-center gap-3 border border-border bg-card px-6 py-4 text-sm transition hover:bg-accent"
              >
                Área do Aluno
              </Link>
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
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">01 / TREINOS</div>
              <h2 className="text-display mt-4 text-5xl sm:text-7xl">Um tatame para<br />cada objetivo.</h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Turmas para todas as idades e níveis — do primeiro kimono ao time de competição.
            </p>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Shirt, t: "Gi · Kimono", d: "Fundamentos e avançado. A base técnica do Jiu-Jitsu tradicional." },
              { i: Wind, t: "No-Gi", d: "Luta sem kimono, wrestling e o jogo de pernas moderno." },
              { i: Baby, t: "Infantil", d: "Disciplina, coordenação e respeito para crianças e adolescentes." },
              { i: Heart, t: "Feminino", d: "Turma exclusiva com foco em técnica, condicionamento e defesa pessoal." },
              { i: Trophy, t: "Competição", d: "Time de competição com preparação física e estratégia de luta." },
              { i: User, t: "Privativa", d: "Aulas individuais com professor faixa-preta no seu ritmo." },
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

      <section id="historia" className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0 grain opacity-60" />
        <div className="text-display pointer-events-none absolute -left-16 top-24 select-none text-[26rem] leading-none text-muted-foreground/[0.035] sm:text-[40rem]">
          X
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36">
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">03 / NOSSA HISTÓRIA</div>
          <h2 className="text-display mt-6 text-6xl leading-[0.85] sm:text-8xl">
            Da Garagem<br />
            <span className="text-muted-foreground">ao Pódio.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Uma história construída com disciplina, coragem e a certeza de que o
            jiu-jítsu é capaz de transformar vidas.
          </p>

          <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-12">
            {/* Narrativa */}
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:col-span-7">
              <p className="text-foreground">
                <span className="text-display float-left mr-3 mt-1 text-6xl leading-[0.7] text-foreground">M</span>
                eu nome é Eduardo, sou faixa-preta da equipe Lotus Club e fundador da
                X BJJ School, em Taboão da Serra, São Paulo.
              </p>
              <p>
                Minha história com o jiu-jítsu começou aos 11 anos de idade. Na época,
                eu sofria muito com bullying na escola e procurava uma maneira de
                aprender a me defender. O que eu não imaginava era que aquele primeiro
                treino mudaria completamente o rumo da minha vida.
              </p>
              <p>
                Comecei a competir ainda na faixa branca. Vieram muitas derrotas,
                eliminações na primeira luta e momentos em que cheguei a acreditar que
                não era bom o suficiente.
              </p>

              <blockquote className="border-l-2 border-foreground py-2 pl-6">
                <p className="text-display text-2xl leading-snug text-foreground sm:text-3xl">
                  Mas o jiu-jítsu me ensinou a persistir.
                </p>
              </blockquote>

              <p>
                Na faixa azul, conquistei meu primeiro título. Foi ali que nasceu uma
                paixão pelo esporte competitivo que me levou às maiores conquistas da
                minha carreira.
              </p>
              <p>
                A X BJJ School nasceu de forma simples, dentro da garagem da casa da
                minha mãe. Eu e alguns parceiros de treino queríamos apenas um lugar
                onde pudéssemos evoluir e nos preparar melhor para as competições. Com
                um tatame de apenas <span className="text-foreground">3&times;8 metros</span> e
                muita vontade de crescer, demos início a um sonho.
              </p>
              <p>
                Pouco a pouco, novas pessoas começaram a aparecer. O que era apenas um
                espaço de treino se transformou em uma <span className="text-foreground">família</span>,
                uma equipe e um propósito.
              </p>
            </div>

            {/* Destaques */}
            <aside className="space-y-6 lg:col-span-5">
              <figure className="group overflow-hidden border border-border bg-card">
                <img
                  src={mestreEduardo}
                  alt="Mestre Eduardo, faixa-preta, sendo declarado vencedor em competição"
                  className="w-full transition duration-700 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                  loading="lazy"
                />
                <figcaption className="border-t border-border p-5">
                  <div className="text-display text-lg">Mestre Eduardo</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Fundador da X BJJ School · Faixa-preta Lotus Club
                  </div>
                </figcaption>
              </figure>

              <div className="border border-border bg-card p-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.25em]">Conquistas</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {[
                    "Campeão Paulista",
                    "Campeão Brasileiro",
                    "Campeão Sul-Americano",
                    "Campeão Pan-Americano",
                    "Vice-campeão Mundial · No-Gi",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3 border-b border-border pb-3 text-sm last:border-0 last:pb-0">
                      <Medal className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-border bg-card p-8">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">O nome</div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">X BJJ School</span> é uma homenagem a
                  Malcolm X — símbolo de coragem, liderança e determinação, valores que
                  fazem parte da nossa essência desde a fundação da equipe.
                </p>
                <div className="text-display mt-6 text-2xl">08 · 04 · 2024</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Fundação da equipe</div>
              </div>
            </aside>
          </div>

          {/* Números */}
          <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
            {[
              { k: "100+", v: "Medalhas em menos de 2 anos" },
              { k: "3×8", v: "Metros do primeiro tatame" },
              { k: "03", v: "Federações: CBJJ · CBJJE · BJJF" },
              { k: "01", v: "Garagem onde tudo começou" },
            ].map((s) => (
              <div key={s.v} className="bg-card p-6">
                <div className="text-display text-3xl sm:text-4xl">{s.k}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>

          {/* Maior conquista */}
          <div className="mx-auto mt-24 max-w-4xl text-center">
            <p className="text-display text-3xl leading-tight sm:text-5xl">
              Mas nossa maior conquista não está nas medalhas.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Ela está em cada pessoa que encontrou no tatame mais confiança, disciplina,
              saúde, amizades e um novo propósito de vida.
            </p>
          </div>

          {/* Fechamento cinematográfico */}
          <div className="mt-28 border-t border-border pt-16 text-center">
            <p className="text-display text-4xl leading-[1.05] sm:text-7xl">
              Porque a nossa história<br />começou em uma garagem.
            </p>
            <p className="text-display mt-8 text-4xl leading-[1.05] text-muted-foreground sm:text-7xl">
              E estamos apenas começando.
            </p>
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

      <section id="local" className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">04 / ONDE TREINAR</div>
              <h2 className="text-display mt-4 text-5xl sm:text-6xl">Venha nos<br />visitar.</h2>

              <div className="mt-8 flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
                <p className="text-base">{SCHOOL.address}</p>
              </div>
              <a
                href={`https://wa.me/${SCHOOL.phoneDigits}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-3 text-muted-foreground transition hover:text-foreground"
              >
                <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                <span className="text-base">{SCHOOL.phone}</span>
              </a>
              <p className="mt-2 text-sm text-muted-foreground">
                Aula experimental, dúvidas e informações — chame no WhatsApp.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SCHOOL.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-display inline-flex items-center gap-2 border border-border bg-background px-5 py-3 text-xs transition hover:bg-accent"
                >
                  <MapPin className="h-4 w-4" /> Google Maps
                </a>
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(SCHOOL.address)}&navigate=yes`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-display inline-flex items-center gap-2 border border-border bg-background px-5 py-3 text-xs transition hover:bg-accent"
                >
                  <Navigation className="h-4 w-4" /> Waze
                </a>
                <a
                  href={`https://wa.me/${SCHOOL.phoneDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-display inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs text-primary-foreground transition hover:bg-primary/90"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="min-h-[280px] overflow-hidden border border-border">
              <iframe
                title="Localização da X BJJ School"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(SCHOOL.address)}&output=embed`}
                className="h-full w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <XLogo className="h-10 w-10" />
            <div>
              <div className="text-display text-sm">X Brazilian Jiu-Jitsu School</div>
              <div className="text-xs text-muted-foreground">{SCHOOL.city} · {SCHOOL.phone}</div>
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
