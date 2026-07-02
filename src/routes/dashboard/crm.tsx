import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader, Restricted } from "@/components/dashboard/primitives";
import { FUNNEL, STAGE_LABEL, leadsByStage, LEADS, type Lead } from "@/lib/data";

export const Route = createFileRoute("/dashboard/crm")({
  head: () => ({ meta: [{ title: "CRM / Leads — X BJJ School" }] }),
  component: () => (
    <Restricted allow={["mestre", "adm"]}>
      <CRM />
    </Restricted>
  ),
});

function CRM() {
  const total = LEADS.filter((l) => l.stage !== "perdido").length;
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="CAPTAÇÃO"
        title="CRM / Leads"
        actions={
          <button className="text-display inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Novo lead
          </button>
        }
      />

      <div className="text-sm text-muted-foreground">
        {total} leads ativos no funil · {leadsByStage("matriculado").length} matriculados esta semana
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {FUNNEL.map((stage) => {
          const items = leadsByStage(stage);
          return (
            <div key={stage} className="flex flex-col border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{STAGE_LABEL[stage]}</span>
                <span className="text-display text-sm">{items.length}</span>
              </div>
              <div className="flex-1 space-y-2 p-3">
                {items.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
                {items.length === 0 ? <div className="px-1 py-6 text-center text-xs text-muted-foreground">—</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="border border-border bg-background p-3 transition hover:border-foreground/40">
      <div className="text-sm font-medium">{lead.name}</div>
      <div className="mt-1 text-xs text-muted-foreground">{lead.interest}</div>
      <div className="mt-3 flex items-center justify-between">
        <span className="border border-border px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">{lead.source}</span>
        <span className="text-[10px] text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
      </div>
    </div>
  );
}
