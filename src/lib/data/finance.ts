// Financeiro: começa do ZERO. Sem valor fixo de mensalidade — cada aluno
// paga o combinado (uns 50, outros 60) via Pix de valor ABERTO.

export type InvoiceStatus = "pago" | "pendente" | "atrasado";

export type Invoice = {
  id: string;
  ref: string; // "Jun/2026"
  dueDate: string; // ISO
  amount: number;
  status: InvoiceStatus;
  method?: "Pix" | "Cartão" | "Dinheiro";
};

// Receita dos últimos 12 meses. Zerada — a contabilidade começa agora.
export const REVENUE_12M = [
  { month: "Jul", value: 0 },
  { month: "Ago", value: 0 },
  { month: "Set", value: 0 },
  { month: "Out", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dez", value: 0 },
  { month: "Jan", value: 0 },
  { month: "Fev", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Abr", value: 0 },
  { month: "Mai", value: 0 },
  { month: "Jun", value: 0 },
];

export const FINANCE_SUMMARY = {
  monthlyRevenue: 0,
  revenueDeltaPct: 0,
  defaultRate: 0, // inadimplência %
  pendingAmount: 0,
  paidThisMonth: 0,
  pendingCount: 0,
};

// Faturas do aluno logado. Vazio — começa do zero.
export const MY_INVOICES: Invoice[] = [];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
