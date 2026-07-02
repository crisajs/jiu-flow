-- ============================================================================
-- Auth + papéis (aluno · mestre · adm) e RLS de verdade.
-- Substitui as policies "dev" do 0001 por regras baseadas no papel do usuário.
--
-- Regras de acesso:
--   • Aluno  → só os PRÓPRIOS dados (presença, graduação, mensalidade, perfil)
--   • Mestre → operação (alunos, presença, graduação, eventos) + VÊ financeiro
--   • ADM    → tudo + configurações + EDITA financeiro + gestão de usuários
--   • Público (anon) → só cronograma, eventos e dados da escola (páginas abertas)
-- ============================================================================

-- —————————————————————— Perfil que liga auth.users → papel ——————————————————
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'aluno' check (role in ('aluno', 'mestre', 'adm')),
  student_id uuid references public.students(id) on delete set null,
  full_name  text,
  phone      text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Helpers SECURITY DEFINER: rodam como dono e IGNORAM RLS (evita recursão nas
-- policies que consultam profiles).
create or replace function public.current_app_role() returns text
  language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_student_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select student_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() in ('mestre', 'adm'), false);
$$;

create or replace function public.is_adm() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() = 'adm', false);
$$;

-- Mestre = acesso TOTAL (inclui financeiro). ADM = tudo EXCETO financeiro.
create or replace function public.is_mestre() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() = 'mestre', false);
$$;

-- Todo novo usuário nasce como 'aluno'. ADM promove para mestre/adm depois.
create or replace function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (new.id, 'aluno', new.raw_user_meta_data ->> 'full_name', new.phone)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Policies de profiles
create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());
create policy profiles_self_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
-- Gestão de papéis é do MESTRE (evita o ADM se auto-promover e alcançar o financeiro).
create policy profiles_mestre_manage on public.profiles for all to authenticated
  using (public.is_mestre()) with check (public.is_mestre());

-- —————————————————————— Remove as policies "dev" do 0001 ————————————————————
do $$
declare t text;
begin
  foreach t in array array[
    'school_settings','professors','students','classes','attendance',
    'graduations','invoices','events','event_registrations'
  ] loop
    execute format('drop policy if exists "dev_all_%1$s" on public.%1$I;', t);
  end loop;
end $$;

-- —————————————————————————————— Policies reais ——————————————————————————————

-- students: aluno vê o próprio; staff vê/gerencia todos
create policy students_read on public.students for select
  using (public.is_staff() or id = public.current_student_id());
create policy students_write on public.students for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- attendance (presença): aluno vê a própria; staff gerencia
create policy attendance_read on public.attendance for select to authenticated
  using (public.is_staff() or student_id = public.current_student_id());
create policy attendance_write on public.attendance for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- graduations: aluno vê a própria; staff gerencia
create policy graduations_read on public.graduations for select to authenticated
  using (public.is_staff() or student_id = public.current_student_id());
create policy graduations_write on public.graduations for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- invoices (FINANCEIRO): EXCLUSIVO do Mestre (+ aluno vê a própria). ADM não acessa.
create policy invoices_read on public.invoices for select to authenticated
  using (public.is_mestre() or student_id = public.current_student_id());
create policy invoices_write on public.invoices for all to authenticated
  using (public.is_mestre()) with check (public.is_mestre());

-- classes (cronograma): leitura pública; staff edita
create policy classes_read on public.classes for select using (true);
create policy classes_write on public.classes for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- events: leitura pública (página compartilhável); staff cria/edita
create policy events_read on public.events for select using (true);
create policy events_write on public.events for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- event_registrations (RSVP): aluno gerencia a própria; staff vê/gerencia todas
create policy event_regs_read on public.event_registrations for select to authenticated
  using (public.is_staff() or student_id = public.current_student_id());
create policy event_regs_self on public.event_registrations for all to authenticated
  using (public.is_staff() or student_id = public.current_student_id())
  with check (public.is_staff() or student_id = public.current_student_id());

-- school_settings: leitura pública (geofence/QR/Pix); staff (mestre+adm) edita
create policy settings_read on public.school_settings for select using (true);
create policy settings_write on public.school_settings for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- professors: leitura pública (site/config); staff (mestre+adm) edita
create policy professors_read on public.professors for select using (true);
create policy professors_write on public.professors for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- —————————————— Controle de acesso: só matriculado vira aluno ——————————————
-- Novo login (Google) nasce com profiles.student_id = NULL → é VISITANTE:
-- só vê agendamento de aula experimental. Para liberar a área do aluno, ele
-- reivindica a matrícula (código único). Segundo fator opcional pode ser
-- adicionado depois (ex.: últimos 4 dígitos do WhatsApp).
create or replace function public.claim_enrollment(p_code text) returns boolean
  language plpgsql security definer set search_path = public as $$
declare s_id uuid;
begin
  select id into s_id from public.students where enrollment_code = p_code;
  if s_id is null then
    return false; -- matrícula inexistente
  end if;
  -- matrícula já vinculada a OUTRO usuário?
  if exists (select 1 from public.profiles where student_id = s_id and id <> auth.uid()) then
    return false;
  end if;
  update public.profiles set student_id = s_id, role = 'aluno' where id = auth.uid();
  return true;
end $$;
grant execute on function public.claim_enrollment(text) to authenticated;

-- ============================================================================
-- LOGIN DO ALUNO = Google OAuth. Depois de logar, reivindica a matrícula
--   (claim_enrollment) para vincular profiles.student_id e liberar a área.
-- LOGIN DA EQUIPE = e-mail + senha em rota oculta /gestao.
--   Painel Supabase → Authentication → Providers: habilite Google (Client ID/
--   Secret do Google Cloud) e Email (para a equipe).
--   Bootstrap (papéis desta escola):
--     Mestre (acesso TOTAL, inclui financeiro) → edu.allves1460@gmail.com
--     ADM (tudo EXCETO financeiro)             → vitor.amaral1460@gmail.com
--   Crie os dois usuários (email+senha) e rode:
--     update public.profiles set role='mestre' where id = (select id from auth.users where email='edu.allves1460@gmail.com');
--     update public.profiles set role='adm'    where id = (select id from auth.users where email='vitor.amaral1460@gmail.com');
-- ============================================================================
