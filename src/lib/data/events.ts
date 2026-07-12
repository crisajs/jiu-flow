// Eventos da escola: campeonatos internos, seminários, graduações.

export type SchoolEvent = {
  id: string;
  title: string;
  type: "Campeonato" | "Seminário" | "Graduação" | "Open Mat" | "Social";
  date: string; // ISO
  time: string;
  location: string;
  description: string;
  registered: number;
  capacity: number;
  /** se o aluno logado já está inscrito */
  iAmIn?: boolean;
};

// Vazio — a escola cria os eventos reais. Começa do zero.
export const EVENTS: SchoolEvent[] = [];
