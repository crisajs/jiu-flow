import type { BeltId } from "../belts";

// Base real dos alunos da X BJJ School (importada da planilha alunos.xlsx).
// PII de pessoas reais — quando o Supabase conectar (Fase B), isto vira seed
// do banco e sai do código versionado.

export type StudentStatus = "ativo" | "inadimplente" | "experimental";

export type Student = {
  id: string;
  name: string;
  initials: string;
  belt: BeltId;
  stripes: number; // graus 0-4
  category: string; // Adultos | Juvenil | Infantil
  plan: string;
  monthlyFee: number;
  status: StudentStatus;
  joinedAt: string; // ISO
  age: number | null;
  whatsapp: string;
};

export const STUDENTS: Student[] = [
  { id: "al-001", name: "Arthur Alves Santos Santana", initials: "AA", belt: "amarela", stripes: 4, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-10-09", age: 16, whatsapp: "(11) 948746653" },
  { id: "al-002", name: "Caio Paulo da Costa", initials: "CP", belt: "branca", stripes: 2, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-08-11", age: 15, whatsapp: "(11) 965965712" },
  { id: "al-003", name: "Caio Roberto Diniz", initials: "CR", belt: "azul", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-08-12", age: 33, whatsapp: "(11) 963118336" },
  { id: "al-004", name: "Cristiano Anjos", initials: "CA", belt: "branca", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-01-05", age: 27, whatsapp: "(11) 918680249" },
  { id: "al-005", name: "Douglas Ribeiro de Paula Ribeiro", initials: "DR", belt: "cinza", stripes: 2, category: "Infantil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-12-18", age: 18, whatsapp: "(11) 954939327" },
  { id: "al-006", name: "Eduardo De Morder Paulino", initials: "ED", belt: "cinza", stripes: 2, category: "Infantil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-06-05", age: 11, whatsapp: "(11) 949670350" },
  { id: "al-007", name: "Emilly Santos da Silva", initials: "ES", belt: "branca", stripes: 3, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-08-11", age: 15, whatsapp: "(11) 962766450" },
  { id: "al-008", name: "Eric Silva Nunes", initials: "ES", belt: "azul", stripes: 2, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-04-08", age: 24, whatsapp: "(11) 954947737" },
  { id: "al-009", name: "Gabriel Cardoso Silva", initials: "GC", belt: "verde", stripes: 2, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-11-06", age: 15, whatsapp: "(11) 964642932" },
  { id: "al-010", name: "Giovanna B. F. da Silva", initials: "GB", belt: "branca", stripes: 0, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-02-23", age: 15, whatsapp: "(11) 957159911" },
  { id: "al-011", name: "Glaucos Matheus Pereira Barbosa", initials: "GM", belt: "roxa", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-04-08", age: 29, whatsapp: "(11) 941945991" },
  { id: "al-012", name: "Gregory Cainã Zambom dos Santos", initials: "GC", belt: "azul", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-04-08", age: 27, whatsapp: "(11) 940803460" },
  { id: "al-013", name: "Gustavo Barbosa", initials: "GB", belt: "branca", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-06-04", age: 22, whatsapp: "(11) 994056899" },
  { id: "al-014", name: "João Henrique Santos Silva", initials: "JH", belt: "branca", stripes: 2, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-09-08", age: 25, whatsapp: "(11) 977505557" },
  { id: "al-015", name: "Joaquim Souza Soares", initials: "JS", belt: "cinza", stripes: 2, category: "Infantil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-05-08", age: 10, whatsapp: "(11) 941043028" },
  { id: "al-016", name: "Kaue Alves Mariano", initials: "KA", belt: "branca", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-05-20", age: 23, whatsapp: "(11)986647173" },
  { id: "al-017", name: "Kiara Aparecida Menezes Alves", initials: "KA", belt: "branca", stripes: 0, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-01-07", age: 16, whatsapp: "(11) 958376551" },
  { id: "al-018", name: "Leonardo Santos Rodrigues", initials: "LS", belt: "azul", stripes: 2, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-04-08", age: 20, whatsapp: "(11) 970308521" },
  { id: "al-019", name: "Lucas Alves de Oliveira", initials: "LA", belt: "branca", stripes: 3, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-08-21", age: 16, whatsapp: "(11) 994505969" },
  { id: "al-020", name: "Maria Isadora Lopes Afonso", initials: "MI", belt: "branca", stripes: 0, category: "Infantil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-05-18", age: 12, whatsapp: "(11) 951238712" },
  { id: "al-021", name: "Matheus França dos Santos", initials: "MF", belt: "branca", stripes: 2, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-02-14", age: 29, whatsapp: "(11) 947976012" },
  { id: "al-022", name: "Miguel Ballestero Nicácio", initials: "MB", belt: "branca", stripes: 2, category: "Infantil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-10-30", age: 9, whatsapp: "(11) 916586528" },
  { id: "al-023", name: "Miguel Luiz Alonço Gonçalves", initials: "ML", belt: "azul", stripes: 0, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-08-14", age: 16, whatsapp: "(11) 947222683" },
  { id: "al-024", name: "Noach David Santos Mendes", initials: "ND", belt: "cinza", stripes: 2, category: "Infantil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-04-08", age: 7, whatsapp: "(11) 991120710" },
  { id: "al-025", name: "Pedro Augusto Dos Santos Oliveira Gama", initials: "PA", belt: "branca", stripes: 1, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-01-22", age: 22, whatsapp: "(11) 948611745" },
  { id: "al-026", name: "Pedro Henrique Tambucci Silva", initials: "PH", belt: "roxa", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-10-01", age: 19, whatsapp: "(11) 982221645" },
  { id: "al-027", name: "Renan Gustavo Alves Mariano", initials: "RG", belt: "roxa", stripes: 2, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-04-08", age: 30, whatsapp: "(11) 958390815" },
  { id: "al-028", name: "Samuel Vasconcelos Alves Soares", initials: "SV", belt: "azul", stripes: 0, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-10-03", age: 15, whatsapp: "(11) 959432575" },
  { id: "al-029", name: "Samuel Ventura de Oliveira", initials: "SV", belt: "azul", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-01-15", age: 24, whatsapp: "(11) 941568167" },
  { id: "al-030", name: "Talita Sudário Gomes", initials: "TS", belt: "azul", stripes: 0, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2025-01-24", age: 36, whatsapp: "(11) 949786400" },
  { id: "al-031", name: "Vitor do Amaral Nogueira Pinheiro", initials: "VD", belt: "azul", stripes: 3, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-12-18", age: 20, whatsapp: "(11) 977376619" },
  { id: "al-032", name: "Wanderlley da Silva", initials: "WD", belt: "branca", stripes: 0, category: "Juvenil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-06-17", age: 15, whatsapp: "(11) 990032628" },
  { id: "al-033", name: "Weslley Luiz de Lourdes", initials: "WL", belt: "marrom", stripes: 2, category: "Adultos", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2024-04-08", age: 30, whatsapp: "(11) 934395085" },
  { id: "al-034", name: "Yan Alcântara Grabowski", initials: "YA", belt: "branca", stripes: 0, category: "Infantil", plan: "Mensal", monthlyFee: 60, status: "ativo", joinedAt: "2026-03-30", age: 8, whatsapp: "(11) 952036168" },
];

// Aluno "logado" no perfil de demonstração de Aluno (Cristiano Anjos).
export const CURRENT_STUDENT: Student = { ...(STUDENTS.find((s) => s.name.startsWith("Cristiano")) ?? STUDENTS[0]), id: "me" };

export function beltCounts(students: Student[] = STUDENTS) {
  return students.reduce<Record<string, number>>((acc, s) => {
    acc[s.belt] = (acc[s.belt] ?? 0) + 1;
    return acc;
  }, {});
}
