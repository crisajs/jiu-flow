// CRM / Funil de leads (captação até matrícula). Visível só para ADM.

export type LeadStage = "novo" | "contato" | "agendado" | "compareceu" | "matriculado" | "perdido";

export const STAGE_LABEL: Record<LeadStage, string> = {
  novo: "Novo",
  contato: "Em contato",
  agendado: "Aula agendada",
  compareceu: "Compareceu",
  matriculado: "Matriculado",
  perdido: "Perdido",
};

// Ordem do funil (perdido fica de fora do board principal).
export const FUNNEL: LeadStage[] = ["novo", "contato", "agendado", "compareceu", "matriculado"];

export type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  source: "Instagram" | "Indicação" | "Google" | "Fachada" | "Site";
  interest: string;
  stage: LeadStage;
  createdAt: string; // ISO date
};

export const LEADS: Lead[] = [
  { id: "l1", name: "Marcelo Antunes", whatsapp: "(11) 99812-3340", source: "Instagram", interest: "Adulto Gi", stage: "novo", createdAt: "2026-06-27" },
  { id: "l2", name: "Priscila Nunes", whatsapp: "(11) 99745-8821", source: "Indicação", interest: "Feminino", stage: "novo", createdAt: "2026-06-26" },
  { id: "l3", name: "Eduardo Ramos", whatsapp: "(11) 99634-1209", source: "Google", interest: "No-Gi", stage: "contato", createdAt: "2026-06-25" },
  { id: "l4", name: "Tatiane Lopes", whatsapp: "(11) 99588-7763", source: "Instagram", interest: "Adulto Gi", stage: "contato", createdAt: "2026-06-24" },
  { id: "l5", name: "Família Moreira", whatsapp: "(11) 99471-5582", source: "Fachada", interest: "Infantil", stage: "agendado", createdAt: "2026-06-23" },
  { id: "l6", name: "Roberto Dias", whatsapp: "(11) 99320-4417", source: "Site", interest: "Competição", stage: "agendado", createdAt: "2026-06-22" },
  { id: "l7", name: "Carla Bittencourt", whatsapp: "(11) 99284-9930", source: "Indicação", interest: "Feminino", stage: "compareceu", createdAt: "2026-06-20" },
  { id: "l8", name: "Igor Faria", whatsapp: "(11) 99155-2261", source: "Instagram", interest: "Adulto Gi", stage: "compareceu", createdAt: "2026-06-19" },
  { id: "l9", name: "Sandra Vieira", whatsapp: "(11) 99044-8810", source: "Google", interest: "Adulto Gi", stage: "matriculado", createdAt: "2026-06-15" },
  { id: "l10", name: "Wesley Pinto", whatsapp: "(11) 98933-1147", source: "Indicação", interest: "No-Gi", stage: "matriculado", createdAt: "2026-06-12" },
  { id: "l11", name: "Débora Castro", whatsapp: "(11) 98821-7754", source: "Instagram", interest: "Feminino", stage: "perdido", createdAt: "2026-06-08" },
];

export function leadsByStage(stage: LeadStage) {
  return LEADS.filter((l) => l.stage === stage);
}
