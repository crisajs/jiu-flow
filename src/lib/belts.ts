// Sistema de faixas do Jiu-Jitsu (IBJJF) — adulto e infantil.
// Cores expostas como classe Tailwind (bg/text) e hex para gráficos.

export type BeltId =
  | "branca"
  | "cinza"
  | "amarela"
  | "laranja"
  | "verde"
  | "azul"
  | "roxa"
  | "marrom"
  | "preta";

export type Belt = {
  id: BeltId;
  label: string;
  /** Faixa etária a que pertence */
  track: "adulto" | "infantil";
  /** classe Tailwind de fundo da faixa */
  bg: string;
  /** classe Tailwind do texto sobre a faixa */
  fg: string;
  /** hex para Recharts e barras */
  hex: string;
};

export const BELTS: Record<BeltId, Belt> = {
  branca: { id: "branca", label: "Branca", track: "adulto", bg: "bg-neutral-200", fg: "text-neutral-900", hex: "#e5e5e5" },
  cinza: { id: "cinza", label: "Cinza", track: "infantil", bg: "bg-neutral-500", fg: "text-white", hex: "#737373" },
  amarela: { id: "amarela", label: "Amarela", track: "infantil", bg: "bg-yellow-400", fg: "text-neutral-900", hex: "#facc15" },
  laranja: { id: "laranja", label: "Laranja", track: "infantil", bg: "bg-orange-500", fg: "text-white", hex: "#f97316" },
  verde: { id: "verde", label: "Verde", track: "infantil", bg: "bg-green-600", fg: "text-white", hex: "#16a34a" },
  azul: { id: "azul", label: "Azul", track: "adulto", bg: "bg-blue-600", fg: "text-white", hex: "#2563eb" },
  roxa: { id: "roxa", label: "Roxa", track: "adulto", bg: "bg-purple-600", fg: "text-white", hex: "#9333ea" },
  marrom: { id: "marrom", label: "Marrom", track: "adulto", bg: "bg-amber-800", fg: "text-white", hex: "#92400e" },
  preta: { id: "preta", label: "Preta", track: "adulto", bg: "bg-neutral-900", fg: "text-white", hex: "#171717" },
};

/** Ordem de progressão adulto */
export const ADULT_ORDER: BeltId[] = ["branca", "azul", "roxa", "marrom", "preta"];
/** Ordem de progressão infantil (simplificada) */
export const KID_ORDER: BeltId[] = ["branca", "cinza", "amarela", "laranja", "verde"];

export function nextBelt(id: BeltId): Belt | null {
  const order = BELTS[id].track === "infantil" || KID_ORDER.includes(id) ? KID_ORDER : ADULT_ORDER;
  const idx = order.indexOf(id);
  if (idx === -1 || idx === order.length - 1) return null;
  return BELTS[order[idx + 1]];
}

// Mapeia o nome da faixa (PT, como vem da planilha) para o id interno.
const NAME_TO_ID: Record<string, BeltId> = {
  branca: "branca",
  cinza: "cinza",
  amarela: "amarela",
  laranja: "laranja",
  verde: "verde",
  azul: "azul",
  roxa: "roxa",
  roza: "roxa", // tolera o erro de digitação "Roza"
  marrom: "marrom",
  preta: "preta",
};

/** Parseia "Branca 2", "Azul", "Amarela 4", "Roza 2" → { belt, stripes }. */
export function parseBelt(raw: string): { belt: BeltId; stripes: number } {
  const norm = raw.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
  const name = norm.replace(/[^a-z]/g, " ").trim().split(/\s+/)[0] ?? "";
  const num = norm.match(/(\d+)/);
  return {
    belt: NAME_TO_ID[name] ?? "branca",
    stripes: num ? Math.min(4, parseInt(num[1], 10)) : 0,
  };
}

/** Rótulo amigável: "Branca", "Branca · 1 grau", "Branca · 2 graus". */
export function beltLabel(belt: BeltId, stripes = 0): string {
  const base = BELTS[belt].label;
  if (!stripes) return base;
  return `${base} · ${stripes} ${stripes === 1 ? "grau" : "graus"}`;
}
