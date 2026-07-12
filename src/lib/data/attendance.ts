// Presença: começa do ZERO. Dados reais entram pela chamada do professor (banco).

export const ATTENDANCE_TODAY = {
  present: 0,
  expected: 0,
  rate: 0, // %
};

// Presença média por dia da semana (para gráfico ADM). Zerado.
export const ATTENDANCE_BY_WEEKDAY = [
  { day: "Seg", value: 0 },
  { day: "Ter", value: 0 },
  { day: "Qua", value: 0 },
  { day: "Qui", value: 0 },
  { day: "Sex", value: 0 },
];

// Check-ins recentes (feed do ADM). Vazio.
export type CheckIn = { name: string; initials: string; className: string; at: string };
export const RECENT_CHECKINS: CheckIn[] = [];

// Histórico do aluno logado. Zerado — começa a contabilidade do 0.
export type MyAttendanceDay = { date: string; className: string; present: boolean };

export const MY_ATTENDANCE = {
  streak: 0,
  thisMonth: 0,
  monthGoal: 16,
  rate: 0,
  recent: [] as MyAttendanceDay[],
};
