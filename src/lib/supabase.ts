import { createClient } from "@supabase/supabase-js";

// Client do Supabase (browser). As chaves públicas vêm do .env com prefixo VITE_.
// A anon key é pública por design — a segurança fica nas policies de RLS.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** true quando as credenciais já foram configuradas no .env */
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes — configure o .env para conectar ao banco.",
  );
}

// Usa placeholders inofensivos quando ainda não há credenciais, para o app
// continuar montando (as telas tratam o estado vazio/sem conexão).
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "public-anon-placeholder",
);
