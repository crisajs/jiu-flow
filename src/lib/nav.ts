import {
  LayoutDashboard, UserPlus, Users, Calendar, Activity, Trophy,
  Wallet, MessageCircle, Award, BookOpen, BarChart3, Settings,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./auth";

export type NavItem = {
  icon: LucideIcon;
  /** rótulo padrão (staff) */
  label: string;
  /** rótulo alternativo para o perfil Aluno */
  alunoLabel?: string;
  to: string;
  roles: Role[];
  /** false = rota existe mas fica fora da sidebar (feature guardada p/ depois) */
  enabled?: boolean;
};

// Fonte única da navegação. A sidebar filtra por papel + enabled a partir daqui.
// Lançamento enxuto: CRM, Biblioteca, Relatórios e WhatsApp ficam desativados
// (enabled:false) — o código continua, só não aparece no menu.
export const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", alunoLabel: "Início", to: "/dashboard", roles: ["aluno", "mestre", "adm"] },
  { icon: UserPlus, label: "CRM / Leads", to: "/dashboard/crm", roles: ["mestre", "adm"], enabled: false },
  { icon: Users, label: "Alunos", to: "/dashboard/alunos", roles: ["mestre", "adm"] },
  { icon: Calendar, label: "Cronograma", to: "/dashboard/cronograma", roles: ["aluno", "mestre", "adm"] },
  { icon: Activity, label: "Presença", alunoLabel: "Minha Presença", to: "/dashboard/presenca", roles: ["aluno", "mestre", "adm"] },
  { icon: Trophy, label: "Faixas", alunoLabel: "Minha Faixa", to: "/dashboard/graduacoes", roles: ["aluno", "mestre", "adm"] },
  { icon: Wallet, label: "Financeiro", alunoLabel: "Mensalidade", to: "/dashboard/financeiro", roles: ["aluno", "mestre"] },
  { icon: MessageCircle, label: "WhatsApp", to: "/dashboard/whatsapp", roles: ["adm"], enabled: false },
  { icon: Award, label: "Eventos", to: "/dashboard/eventos", roles: ["aluno", "mestre", "adm"] },
  { icon: BookOpen, label: "Biblioteca", to: "/dashboard/biblioteca", roles: ["aluno", "mestre", "adm"], enabled: false },
  { icon: BarChart3, label: "Relatórios", to: "/dashboard/relatorios", roles: ["mestre", "adm"], enabled: false },
  { icon: Settings, label: "Configurações", alunoLabel: "Meu Perfil", to: "/dashboard/configuracoes", roles: ["aluno", "mestre", "adm"] },
];

export function navForRole(role: Role) {
  return NAV.filter((item) => item.enabled !== false && item.roles.includes(role));
}

export function labelFor(item: NavItem, role: Role) {
  return role === "aluno" && item.alunoLabel ? item.alunoLabel : item.label;
}
