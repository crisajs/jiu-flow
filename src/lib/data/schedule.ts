// Cronograma semanal de aulas da X BJJ School.

export type ClassCategory = "Gi" | "No-Gi" | "Infantil" | "Feminino" | "Competição" | "Privativa";

export type ClassSession = {
  id: string;
  day: number; // 0=Dom ... 6=Sáb
  start: string; // "19:30"
  end: string;
  title: string;
  category: ClassCategory;
  professor: string;
  capacity: number;
  enrolled: number;
};

export const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const DAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const PROFESSORS = ["Mestre Xavier", "Prof. Ana Reis", "Prof. Bruno Tavares"];

const CAT_HEX: Record<ClassCategory, string> = {
  Gi: "#2563eb",
  "No-Gi": "#9333ea",
  Infantil: "#facc15",
  Feminino: "#ec4899",
  Competição: "#ef4444",
  Privativa: "#737373",
};
export const categoryHex = (c: ClassCategory) => CAT_HEX[c];

/** "Com Kimono" (Gi) / "Sem Kimono" (No-Gi) — o tipo de aula da grade. */
export const gearLabel = (c: ClassCategory) => (c === "Gi" ? "Com Kimono" : c === "No-Gi" ? "Sem Kimono" : c);

// Grade oficial da X BJJ School (Segunda a Sexta).
export const SCHEDULE: ClassSession[] = [
  // Segunda
  { id: "seg-1", day: 1, start: "19:00", end: "20:00", title: "Kids / Juvenil", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
  { id: "seg-2", day: 1, start: "20:30", end: "22:00", title: "Adulto", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
  // Terça
  { id: "ter-1", day: 2, start: "07:30", end: "09:00", title: "Livre", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
  { id: "ter-2", day: 2, start: "19:00", end: "20:00", title: "Kids / Juvenil", category: "No-Gi", professor: "", capacity: 30, enrolled: 0 },
  { id: "ter-3", day: 2, start: "20:30", end: "22:00", title: "Adulto", category: "No-Gi", professor: "", capacity: 30, enrolled: 0 },
  // Quarta
  { id: "qua-1", day: 3, start: "19:00", end: "20:00", title: "Kids / Juvenil", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
  { id: "qua-2", day: 3, start: "20:30", end: "22:00", title: "Adulto", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
  // Quinta
  { id: "qui-1", day: 4, start: "07:30", end: "09:00", title: "Livre", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
  { id: "qui-2", day: 4, start: "19:00", end: "20:00", title: "Kids / Juvenil", category: "No-Gi", professor: "", capacity: 30, enrolled: 0 },
  { id: "qui-3", day: 4, start: "20:30", end: "22:00", title: "Adulto", category: "No-Gi", professor: "", capacity: 30, enrolled: 0 },
  // Sexta
  { id: "sex-1", day: 5, start: "19:00", end: "20:00", title: "Kids / Juvenil", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
  { id: "sex-2", day: 5, start: "20:30", end: "22:00", title: "Adulto", category: "Gi", professor: "", capacity: 30, enrolled: 0 },
];

export function scheduleByDay() {
  return DAYS.map((_, day) => SCHEDULE.filter((s) => s.day === day).sort((a, b) => a.start.localeCompare(b.start)));
}

// Próxima aula a partir de agora (para dashboards).
export function nextSession(now: Date = new Date()): ClassSession | undefined {
  const today = now.getDay();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  for (let offset = 0; offset < 7; offset++) {
    const day = (today + offset) % 7;
    const candidates = SCHEDULE.filter((s) => s.day === day && (offset > 0 || s.start > hhmm)).sort((a, b) =>
      a.start.localeCompare(b.start),
    );
    if (candidates.length) return candidates[0];
  }
  return SCHEDULE[0];
}
