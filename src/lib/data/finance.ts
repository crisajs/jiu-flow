// Financeiro: receita mensal, mensalidades e faturas do aluno.

export type InvoiceStatus = "pago" | "pendente" | "atrasado";

export type Invoice = {
  id: string;
  ref: string; // "Jun/2026"
  dueDate: string; // ISO
  amount: number;
  status: InvoiceStatus;
  method?: "Pix" | "Cartão" | "Dinheiro";
};

// Receita dos últimos 12 meses (crescimento de escola jovem).
export const REVENUE_12M = [
  { month: "Jul", value: 14200 },
  { month: "Ago", value: 15600 },
  { month: "Set", value: 16900 },
  { month: "Out", value: 18100 },
  { month: "Nov", value: 19400 },
  { month: "Dez", value: 18800 },
  { month: "Jan", value: 21200 },
  { month: "Fev", value: 22600 },
  { month: "Mar", value: 23900 },
  { month: "Abr", value: 24800 },
  { month: "Mai", value: 25600 },
  { month: "Jun", value: 26840 },
];

export const FINANCE_SUMMARY = {
  monthlyRevenue: 26840,
  revenueDeltaPct: 12,
  defaultRate: 4.2, // inadimplência %
  pendingAmount: 3480,
  paidThisMonth: 88,
  pendingCount: 8,
};

// Faturas do aluno logado (perfil Aluno). Mensalidade R$ 60.
export const MY_INVOICES: Invoice[] = [
  { id: "i1", ref: "Jun/2026", dueDate: "2026-06-10", amount: 60, status: "pago", method: "Pix" },
  { id: "i2", ref: "Jul/2026", dueDate: "2026-07-10", amount: 60, status: "pendente" },
  { id: "i3", ref: "Mai/2026", dueDate: "2026-05-10", amount: 60, status: "pago", method: "Pix" },
  { id: "i4", ref: "Abr/2026", dueDate: "2026-04-10", amount: 60, status: "pago", method: "Pix" },
  { id: "i5", ref: "Mar/2026", dueDate: "2026-03-10", amount: 60, status: "pago", method: "Pix" },
];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
