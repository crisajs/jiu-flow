// Presença: check-ins de hoje (ADM) e histórico do aluno logado.

export const ATTENDANCE_TODAY = {
  present: 21,
  expected: 34,
  rate: 62, // %
};

// Presença média por dia da semana (para gráfico ADM).
export const ATTENDANCE_BY_WEEKDAY = [
  { day: "Seg", value: 78 },
  { day: "Ter", value: 64 },
  { day: "Qua", value: 81 },
  { day: "Qui", value: 59 },
  { day: "Sex", value: 72 },
  { day: "Sáb", value: 88 },
];

// Check-ins recentes (feed do ADM).
export type CheckIn = { name: string; initials: string; className: string; at: string };
export const RECENT_CHECKINS: CheckIn[] = [
  { name: "Eric Silva Nunes", initials: "ES", className: "Gi · Todos os níveis", at: "19:28" },
  { name: "Glaucos Matheus Pereira Barbosa", initials: "GM", className: "Competição", at: "19:31" },
  { name: "Cristiano Anjos", initials: "CA", className: "Gi · Todos os níveis", at: "19:32" },
  { name: "Talita Sudário Gomes", initials: "TS", className: "Gi · Todos os níveis", at: "19:33" },
  { name: "Vitor do Amaral Nogueira Pinheiro", initials: "VD", className: "Competição", at: "19:35" },
];

// Histórico do aluno logado.
export type MyAttendanceDay = { date: string; className: string; present: boolean };

export const MY_ATTENDANCE = {
  streak: 6, // aulas seguidas
  thisMonth: 14,
  monthGoal: 16,
  rate: 82,
  recent: [
    { date: "2026-06-27", className: "Gi · Todos os níveis", present: true },
    { date: "2026-06-25", className: "Gi · Fundamentos", present: true },
    { date: "2026-06-24", className: "Competição", present: true },
    { date: "2026-06-23", className: "Gi · Todos os níveis", present: true },
    { date: "2026-06-20", className: "Open Mat", present: true },
    { date: "2026-06-18", className: "Gi · Fundamentos", present: false },
  ] as MyAttendanceDay[],
};
