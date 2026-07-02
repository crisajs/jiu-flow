// Dados institucionais da X Brazilian Jiu-Jitsu School.
// Escola ÚNICA (não é plataforma multi-academias). Fundada em 2024.

export const SCHOOL = {
  name: "X Brazilian Jiu-Jitsu School",
  shortName: "X BJJ School",
  foundedYear: 2024,
  city: "Taboão da Serra · SP",
  address: "Rua Ermelino José de Oliveira, 519 – Parque Pinheiros, Taboão da Serra – SP",
  phone: "+55 11 92462-3307",
  phoneDigits: "5511924623307", // para wa.me / tel:
  // Estatísticas realistas para uma escola com 2 anos de tatame.
  stats: {
    activeStudents: 34,
    blackBeltProfessors: 3, // professores que já chegaram graduados (linhagem)
    monthlyRetention: 91, // %
    graduationsDone: 12, // graduações de grau/faixa desde a abertura
  },
} as const;

export function schoolAgeYears(now: Date = new Date()): number {
  return now.getFullYear() - SCHOOL.foundedYear;
}
