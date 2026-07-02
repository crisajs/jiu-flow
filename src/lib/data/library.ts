// Biblioteca técnica: vídeos e materiais por faixa/posição. Acesso a todos.

export type Technique = {
  id: string;
  title: string;
  position: "Guarda" | "Passagem" | "Raspagem" | "Montada" | "Costas" | "Finalização" | "Defesa";
  belt: "Branca" | "Azul" | "Roxa" | "Todas";
  durationMin: number;
  professor: string;
  gi: "Gi" | "No-Gi" | "Ambos";
};

export const LIBRARY: Technique[] = [
  { id: "t1", title: "Armlock pela montada", position: "Finalização", belt: "Branca", durationMin: 8, professor: "Mestre Xavier", gi: "Ambos" },
  { id: "t2", title: "Raspagem de gancho (hook sweep)", position: "Raspagem", belt: "Branca", durationMin: 11, professor: "Prof. Bruno Tavares", gi: "Gi" },
  { id: "t3", title: "Passagem toreando", position: "Passagem", belt: "Azul", durationMin: 14, professor: "Mestre Xavier", gi: "Ambos" },
  { id: "t4", title: "Triângulo da guarda fechada", position: "Finalização", belt: "Azul", durationMin: 12, professor: "Prof. Ana Reis", gi: "Ambos" },
  { id: "t5", title: "Berimbolo — entrada básica", position: "Guarda", belt: "Roxa", durationMin: 18, professor: "Prof. Bruno Tavares", gi: "Gi" },
  { id: "t6", title: "Defesa de mata-leão", position: "Defesa", belt: "Branca", durationMin: 7, professor: "Prof. Ana Reis", gi: "Ambos" },
  { id: "t7", title: "Controle das costas e finalização", position: "Costas", belt: "Azul", durationMin: 15, professor: "Mestre Xavier", gi: "No-Gi" },
  { id: "t8", title: "Knee-cut com pressão", position: "Passagem", belt: "Roxa", durationMin: 13, professor: "Mestre Xavier", gi: "Gi" },
  { id: "t9", title: "Saída de 100kg (side control)", position: "Defesa", belt: "Branca", durationMin: 9, professor: "Prof. Bruno Tavares", gi: "Ambos" },
  { id: "t10", title: "Estrangulamento Ezequiel", position: "Finalização", belt: "Azul", durationMin: 6, professor: "Prof. Ana Reis", gi: "Gi" },
];

export const LIBRARY_POSITIONS = ["Todas", "Guarda", "Passagem", "Raspagem", "Montada", "Costas", "Finalização", "Defesa"] as const;
