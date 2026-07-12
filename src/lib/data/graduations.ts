import type { BeltId } from "../belts";

// Graduações: próxima cerimônia, candidatos e progresso do aluno.

export type GradCandidate = {
  studentName: string;
  initials: string;
  from: BeltId;
  to: BeltId;
  kind: "faixa" | "grau";
  readiness: number; // 0-100
};

export const NEXT_CEREMONY = {
  date: "2026-07-12",
  label: "Cerimônia de Graduação · Inverno",
  location: "Tatame Principal · X BJJ School",
};

// Candidatos reais à próxima cerimônia (derivados da base de alunos).
export const GRAD_CANDIDATES: GradCandidate[] = [
  { studentName: "Lucas Alves de Oliveira", initials: "LA", from: "branca", to: "azul", kind: "faixa", readiness: 90 },
  { studentName: "Vitor do Amaral Nogueira Pinheiro", initials: "VD", from: "azul", to: "azul", kind: "grau", readiness: 85 },
  { studentName: "Arthur Alves Santos Santana", initials: "AA", from: "amarela", to: "laranja", kind: "faixa", readiness: 88 },
  { studentName: "Renan Gustavo Alves Mariano", initials: "RG", from: "roxa", to: "roxa", kind: "grau", readiness: 80 },
  { studentName: "Emilly Santos da Silva", initials: "ES", from: "branca", to: "azul", kind: "faixa", readiness: 74 },
];

// Checklist técnico do aluno logado para o próximo grau.
export type GradRequirement = { label: string; done: boolean };

// Aluno de demonstração = Cristiano Anjos (faixa branca, turma adultos).
export const MY_GRADUATION = {
  current: { belt: "branca" as BeltId, stripes: 2 },
  target: { belt: "branca" as BeltId, stripes: 3, kind: "grau" as const },
  progress: 55,
  classesAttended: 21,
  classesRequired: 40,
  requirements: [
    { label: "Quedas e amortecimento (ukemi)", done: true },
    { label: "Fuga de quadril e rolamentos", done: true },
    { label: "Saída de montada e de cem-quilos", done: false },
    { label: "Estrangulamento da guarda (cruzado)", done: false },
    { label: "Mínimo de 40 aulas no ciclo", done: false },
  ] as GradRequirement[],
};

// Histórico de faixas do aluno.
export const MY_BELT_HISTORY = [
  { belt: "branca" as BeltId, date: "2026-01-05", note: "Início na X BJJ School" },
];
