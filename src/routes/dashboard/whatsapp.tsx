import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { PageHeader, Restricted, Card } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/dashboard/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp — X BJJ School" }] }),
  component: () => (
    <Restricted allow={["adm"]}>
      <WhatsApp />
    </Restricted>
  ),
});

function WhatsApp() {
  const automations = [
    "Boas-vindas ao novo lead",
    "Lembrete de aula experimental",
    "Confirmação de matrícula",
    "Aviso de mensalidade a vencer",
    "Cobrança de inadimplência",
    "Convite para eventos e graduações",
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader eyebrow="AUTOMAÇÃO" title="WhatsApp" />

      <Card className="flex flex-col items-center py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-accent">
          <MessageCircle className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <span className="text-display mt-6 border border-border px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Em breve
        </span>
        <h2 className="text-display mt-5 max-w-md text-3xl">Mensagens automáticas no piloto automático</h2>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          A integração com WhatsApp será ativada em uma próxima etapa. Abaixo, os fluxos
          que já estão desenhados para entrar no ar.
        </p>

        <div className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
          {automations.map((a) => (
            <div key={a} className="flex items-center gap-3 border border-border bg-background p-4 text-left text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              {a}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
