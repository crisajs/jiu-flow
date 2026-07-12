import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CalendarDays, MapPin, Users, Plus, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, PageHeader, ProgressBar } from "@/components/dashboard/primitives";
import { type SchoolEvent } from "@/lib/data";
import { useEvents, useAddEvent } from "@/lib/db/queries";

export const Route = createFileRoute("/dashboard/eventos")({
  head: () => ({ meta: [{ title: "Eventos — X BJJ School" }] }),
  component: Eventos,
});

const EVENT_TYPES: SchoolEvent["type"][] = ["Campeonato", "Seminário", "Graduação", "Open Mat", "Social"];

function Eventos() {
  const { isStaff } = useAuth();
  const isAdm = isStaff; // mestre e adm podem criar/gerenciar eventos
  const { data: events = [], isLoading } = useEvents();
  const add = useAddEvent();
  const [creating, setCreating] = useState(false);

  function addEvent(e: Omit<SchoolEvent, "id" | "registered">) {
    add.mutate(e, { onSuccess: () => setCreating(false) });
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="AGENDA DA ESCOLA"
        title="Eventos"
        actions={
          isAdm ? (
            <button
              onClick={() => setCreating(true)}
              className="text-display inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Criar evento
            </button>
          ) : undefined
        }
      />

      {isLoading ? (
        <Card className="py-16 text-center text-sm text-muted-foreground">Carregando…</Card>
      ) : events.length === 0 ? (
        <Card className="py-16 text-center text-sm text-muted-foreground">Nenhum evento agendado.</Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((e) => (
            <EventCard key={e.id} e={e} isAdm={isAdm} />
          ))}
        </div>
      )}

      {creating ? <CreateEventModal onClose={() => setCreating(false)} onCreate={addEvent} pending={add.isPending} /> : null}
    </div>
  );
}

function EventCard({ e, isAdm }: { e: SchoolEvent; isAdm: boolean }) {
  const [joined, setJoined] = useState(!!e.iAmIn);
  const registered = e.registered + (joined && !e.iAmIn ? 1 : 0);

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{e.type}</span>
        <span className="text-display text-sm">{new Date(e.date + "T00:00").toLocaleDateString("pt-BR")}</span>
      </div>

      <h3 className="text-display mt-4 text-2xl">{e.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{e.description}</p>

      <div className="mt-5 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" /> {new Date(e.date + "T00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })} · {e.time}</div>
        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.location}</div>
        <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {registered}/{e.capacity} inscritos</div>
      </div>

      <ProgressBar value={(registered / e.capacity) * 100} className="mt-3 h-1" />

      <div className="mt-5">
        {isAdm ? (
          <button className="text-display w-full border border-border px-4 py-3 text-xs transition hover:bg-accent">
            Gerenciar inscrições
          </button>
        ) : (
          <button
            onClick={() => setJoined((v) => !v)}
            className={`text-display w-full px-4 py-3 text-xs transition ${
              joined
                ? "border border-foreground bg-foreground text-background"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {joined ? "Inscrito ✓ · cancelar" : "Quero participar"}
          </button>
        )}
      </div>
    </Card>
  );
}

function CreateEventModal({ onClose, onCreate, pending }: { onClose: () => void; onCreate: (e: Omit<SchoolEvent, "id" | "registered">) => void; pending?: boolean }) {
  const [form, setForm] = useState({
    title: "",
    type: "Campeonato" as SchoolEvent["type"],
    date: "",
    time: "19:00",
    location: "Tatame Principal",
    capacity: 40,
    description: "",
  });

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: k === "capacity" ? Number(e.target.value) : e.target.value }));

  function submit(ev: FormEvent) {
    ev.preventDefault();
    onCreate({
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      capacity: form.capacity,
      description: form.description.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/60 p-4 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-lg border border-border bg-card p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">NOVO EVENTO</div>
            <h2 className="text-display mt-1 text-2xl">Criar evento</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Título">
            <input required value={form.title} onChange={set("title")} placeholder="Open Interno · Verão" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo">
              <select value={form.type} onChange={set("type")} className={inputCls}>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Capacidade">
              <input required type="number" min={1} value={form.capacity} onChange={set("capacity")} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Data">
              <input required type="date" value={form.date} onChange={set("date")} className={inputCls} />
            </Field>
            <Field label="Horário">
              <input required type="time" value={form.time} onChange={set("time")} className={inputCls} />
            </Field>
          </div>

          <Field label="Local">
            <input required value={form.location} onChange={set("location")} className={inputCls} />
          </Field>

          <Field label="Descrição">
            <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Detalhes do evento..." className={inputCls} />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="text-display border border-border px-5 py-3 text-xs transition hover:bg-accent">
              Cancelar
            </button>
            <button type="submit" disabled={pending} className="text-display bg-primary px-5 py-3 text-xs text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
              {pending ? "Publicando…" : "Publicar evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
