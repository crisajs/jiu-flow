import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/primitives";
import { LIBRARY, LIBRARY_POSITIONS, type Technique } from "@/lib/data";

export const Route = createFileRoute("/dashboard/biblioteca")({
  head: () => ({ meta: [{ title: "Biblioteca — X BJJ School" }] }),
  component: Biblioteca,
});

function Biblioteca() {
  const [pos, setPos] = useState<(typeof LIBRARY_POSITIONS)[number]>("Todas");
  const items = useMemo(() => (pos === "Todas" ? LIBRARY : LIBRARY.filter((t) => t.position === pos)), [pos]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="ACERVO TÉCNICO" title="Biblioteca" />

      <div className="flex flex-wrap gap-1">
        {LIBRARY_POSITIONS.map((p) => (
          <button
            key={p}
            onClick={() => setPos(p)}
            className={`border px-3 py-2 text-xs transition ${
              pos === p ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <TechCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}

function TechCard({ t }: { t: Technique }) {
  return (
    <div className="group flex flex-col border border-border bg-card transition hover:border-foreground/40">
      <div className="relative grid aspect-video place-items-center border-b border-border bg-background">
        <Play className="h-10 w-10 text-muted-foreground transition group-hover:scale-110 group-hover:text-foreground" strokeWidth={1.25} />
        <span className="absolute right-2 top-2 border border-border bg-background/80 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
          {t.gi}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t.position} · {t.belt}</div>
        <h3 className="mt-2 flex-1 text-sm font-medium">{t.title}</h3>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.professor}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {t.durationMin} min</span>
        </div>
      </div>
    </div>
  );
}
