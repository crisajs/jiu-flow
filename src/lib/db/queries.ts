import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../auth";
import type { BeltId } from "../belts";
import type { Student } from "../data/students";
import type { ClassSession } from "../data/schedule";
import type { SchoolEvent } from "../data/events";

// ——————————————————————— Mapeadores (linha do banco → shape do app) ———————————————————————

type StudentRow = {
  id: string;
  name: string;
  enrollment_code: string | null;
  email: string | null;
  whatsapp: string | null;
  age: number | null;
  belt: string;
  stripes: number;
  category: string;
  plan: string;
  monthly_fee: number;
  status: string;
  joined_at: string;
};

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

function toStudent(r: StudentRow): Student {
  return {
    id: r.id,
    name: r.name,
    initials: initials(r.name),
    belt: r.belt as BeltId,
    stripes: r.stripes,
    category: r.category,
    plan: r.plan,
    monthlyFee: Number(r.monthly_fee),
    status: r.status as Student["status"],
    joinedAt: r.joined_at,
    age: r.age,
    whatsapp: r.whatsapp ?? "",
  };
}

type ClassRow = {
  id: string;
  title: string;
  category: string;
  weekday: number;
  start_time: string;
  end_time: string;
  professor_id: string | null;
  capacity: number;
};

function toClass(r: ClassRow): ClassSession {
  return {
    id: r.id,
    day: r.weekday,
    start: r.start_time.slice(0, 5),
    end: r.end_time.slice(0, 5),
    title: r.title,
    category: r.category as ClassSession["category"],
    professor: "",
    capacity: r.capacity,
    enrolled: 0,
  };
}

// ——————————————————————————————— Leituras ———————————————————————————————

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async (): Promise<Student[]> => {
      const { data, error } = await supabase.from("students").select("*").order("name");
      if (error) throw error;
      return (data as StudentRow[]).map(toStudent);
    },
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async (): Promise<ClassSession[]> => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("weekday")
        .order("start_time");
      if (error) throw error;
      return (data as ClassRow[]).map(toClass);
    },
  });
}

/** Registro do aluno logado (via profiles.student_id). */
export function useMyStudent() {
  const { user } = useAuth();
  const sid = user?.studentId ?? null;
  return useQuery({
    queryKey: ["my-student", sid],
    enabled: !!sid,
    queryFn: async (): Promise<Student | null> => {
      const { data, error } = await supabase.from("students").select("*").eq("id", sid).maybeSingle();
      if (error) throw error;
      return data ? toStudent(data as StudentRow) : null;
    },
  });
}

// ——————————————————————————————— Escritas ———————————————————————————————

export type NewStudent = {
  name: string;
  whatsapp?: string;
  age?: number | null;
  belt: BeltId;
  stripes: number;
  category: string;
};

export function useAddStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: NewStudent) => {
      const { error } = await supabase.from("students").insert({
        name: s.name.trim(),
        whatsapp: s.whatsapp?.trim() || null,
        age: s.age ?? null,
        belt: s.belt,
        stripes: s.stripes,
        category: s.category,
        plan: "Mensal",
        monthly_fee: 0,
        status: "ativo",
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

/** Gestor/Mestre altera a faixa/grau de qualquer aluno (RLS: staff). */
export function useUpdateBelt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, belt, stripes }: { id: string; belt: BeltId; stripes: number }) => {
      const { error } = await supabase.from("students").update({ belt, stripes }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["my-student"] });
    },
  });
}

/** Aluno atualiza a PRÓPRIA faixa (validação de progressão no banco). */
export function useSetMyBelt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ belt, stripes }: { belt: BeltId; stripes: number }) => {
      const { error } = await supabase.rpc("set_my_belt", { p_belt: belt, p_stripes: stripes });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-student"] }),
  });
}

/** Salva a chamada (presença manual do professor) do dia. */
export function useSaveAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ classId, studentIds }: { classId: string; studentIds: string[] }) => {
      const date = new Date().toISOString().slice(0, 10);
      const rows = studentIds.map((sid) => ({ student_id: sid, class_id: classId, date, method: "professor" }));
      const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "student_id,class_id,date" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance-today"] }),
  });
}

/** Total de presenças registradas hoje. */
export function useAttendanceToday() {
  return useQuery({
    queryKey: ["attendance-today"],
    queryFn: async (): Promise<number> => {
      const date = new Date().toISOString().slice(0, 10);
      const { count, error } = await supabase
        .from("attendance")
        .select("id", { count: "exact", head: true })
        .eq("date", date);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

// ——————————————————————————————— Eventos ———————————————————————————————

type EventRow = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string | null;
  location: string | null;
  description: string | null;
  capacity: number;
};

function toEvent(r: EventRow): SchoolEvent {
  return {
    id: r.id,
    title: r.title,
    type: r.type as SchoolEvent["type"],
    date: r.date,
    time: r.time ?? "",
    location: r.location ?? "",
    description: r.description ?? "",
    registered: 0,
    capacity: r.capacity,
  };
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<SchoolEvent[]> => {
      const { data, error } = await supabase.from("events").select("*").order("date");
      if (error) throw error;
      return (data as EventRow[]).map(toEvent);
    },
  });
}

export function useAddEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: Omit<SchoolEvent, "id" | "registered">) => {
      const { error } = await supabase.from("events").insert({
        title: e.title,
        type: e.type,
        date: e.date,
        time: e.time || null,
        location: e.location || null,
        description: e.description || null,
        capacity: e.capacity,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

// ——————————————————————————————— Realtime ———————————————————————————————

/** Assina mudanças no banco e atualiza as telas AO VIVO. Montar 1x no layout. */
export function useRealtimeSync() {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("app-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, () => {
        qc.invalidateQueries({ queryKey: ["students"] });
        qc.invalidateQueries({ queryKey: ["my-student"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () =>
        qc.invalidateQueries({ queryKey: ["events"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, () =>
        qc.invalidateQueries({ queryKey: ["attendance-today"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
}
