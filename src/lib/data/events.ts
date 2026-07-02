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

export const EVENTS: SchoolEvent[] = [
  {
    id: "e1",
    title: "Open Interno · Inverno",
    type: "Campeonato",
    date: "2026-07-15",
    time: "09:00",
    location: "Tatame Principal",
    description: "Campeonato interno Gi por faixa e peso. Chaves divulgadas na semana do evento.",
    registered: 42,
    capacity: 80,
    iAmIn: true,
  },
  {
    id: "e2",
    title: "Cerimônia de Graduação · Inverno",
    type: "Graduação",
    date: "2026-07-12",
    time: "19:00",
    location: "Tatame Principal",
    description: "Entrega de faixas e graus do ciclo. Presença de toda a comunidade.",
    registered: 60,
    capacity: 120,
  },
  {
    id: "e3",
    title: "Seminário de Leg Lock",
    type: "Seminário",
    date: "2026-08-02",
    time: "14:00",
    location: "Tatame Principal",
    description: "Seminário No-Gi de sistema de pernas com professor convidado faixa-preta.",
    registered: 28,
    capacity: 40,
  },
  {
    id: "e4",
    title: "Open Mat Solidário",
    type: "Social",
    date: "2026-07-26",
    time: "10:00",
    location: "Tatame Principal",
    description: "Treino aberto com arrecadação de alimentos. Convide amigos e familiares.",
    registered: 35,
    capacity: 60,
  },
];
