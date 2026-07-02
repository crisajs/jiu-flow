// Tipos de domínio espelhando o schema (supabase/migrations/0001_init.sql).
// Quando o projeto estiver linkado, dá pra gerar automaticamente com:
//   supabase gen types typescript --linked > src/lib/db/database.types.ts
import type { BeltId } from "../belts";

export type StudentStatus = "ativo" | "inadimplente" | "experimental";
export type AttendanceMethod = "professor" | "qr" | "geo";
export type InvoiceStatus = "pago" | "pendente" | "atrasado";
export type GraduationKind = "faixa" | "grau";

export type SchoolSettings = {
  id: number;
  name: string;
  founded_year: number;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  geofence_radius_m: number;
  checkin_token: string;
};

export type Professor = {
  id: string;
  name: string;
  belt: BeltId;
  active: boolean;
};

export type Student = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  age: number | null;
  belt: BeltId;
  stripes: number;
  category: string;
  plan: string;
  monthly_fee: number;
  status: StudentStatus;
  joined_at: string;
};

export type ClassSession = {
  id: string;
  title: string;
  category: string;
  weekday: number; // 0=Dom..6=Sáb
  start_time: string; // "19:30:00"
  end_time: string;
  professor_id: string | null;
  capacity: number;
};

export type Attendance = {
  id: string;
  student_id: string;
  class_id: string | null;
  date: string;
  method: AttendanceMethod;
  created_at: string;
};

export type Graduation = {
  id: string;
  student_id: string;
  from_belt: BeltId | null;
  to_belt: BeltId;
  kind: GraduationKind;
  date: string | null;
  status: "pendente" | "concluida";
  note: string | null;
};

export type Invoice = {
  id: string;
  student_id: string;
  ref: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  method: string | null;
  paid_at: string | null;
};

export type SchoolEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string | null;
  location: string | null;
  description: string | null;
  capacity: number;
};

export type EventRegistration = {
  id: string;
  event_id: string;
  student_id: string;
};
