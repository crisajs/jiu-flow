import type { BeltId } from "../belts";

// Os alunos REAIS vivem no banco (Supabase) e são lidos via useStudents().
// Este arquivo não guarda mais PII — só o tipo e um placeholder do perfil.

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
  enrollmentCode?: string | null; // matrícula (código de acesso do aluno)
};

// Vazio — os dados vêm do banco.
export const STUDENTS: Student[] = [];

// Placeholder do aluno logado (usado só no modo dev/preview, sem Supabase).
export const CURRENT_STUDENT: Student = {
  id: "me",
  name: "Aluno",
  initials: "AL",
  belt: "branca",
  stripes: 0,
  category: "Adultos",
  plan: "Mensal",
  monthlyFee: 0,
  status: "ativo",
  joinedAt: "2024-01-01",
  age: null,
  whatsapp: "",
};

export function beltCounts(students: Student[] = STUDENTS) {
  return students.reduce<Record<string, number>>((acc, s) => {
    acc[s.belt] = (acc[s.belt] ?? 0) + 1;
    return acc;
  }, {});
}
