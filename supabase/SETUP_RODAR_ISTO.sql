-- ============================================================
-- X BJJ School — RODAR ISTO no SQL Editor do Supabase (uma vez).
-- Limpa qualquer tentativa anterior e cria o schema correto.
-- ============================================================
drop table if exists public.profiles cascade;

-- ============== 0001_init.sql ==============
-- ============================================================================
-- X BJJ School — schema do núcleo (Fase A)
-- Tabelas começam VAZIAS; serão preenchidas pela própria escola.
-- Faixas: branca|azul|roxa|marrom|preta (adulto) · cinza|amarela|laranja|verde (infantil)
-- ============================================================================

-- —————————————————————— Configurações da escola (linha única) ——————————————
create table if not exists public.school_settings (
  id            int primary key default 1,
  name          text not null default 'X Brazilian Jiu-Jitsu School',
  founded_year  int  not null default 2024,
  city          text,
  -- Geofence para check-in automático por localização:
  latitude          double precision,
  longitude         double precision,
  geofence_radius_m int not null default 120,
  -- Token embutido no QR fixo do tatame (rota /checkin?token=...):
  checkin_token text not null default gen_random_uuid()::text,
  updated_at    timestamptz default now(),
  constraint school_settings_single_row check (id = 1)
);

insert into public.school_settings (id) values (1) on conflict (id) do nothing;

-- —————————————————————————————— Professores ————————————————————————————————
create table if not exists public.professors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  belt       text not null default 'preta',
  active     boolean not null default true,
  created_at timestamptz default now()
);

-- ———————————————————————————————— Alunos ———————————————————————————————————
create table if not exists public.students (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  -- Matrícula: código único que o aluno usa para reivindicar o acesso no 1º login.
  enrollment_code text unique,
  email        text,
  whatsapp     text,
  age          int,
  belt         text not null default 'branca',
  stripes      int  not null default 0 check (stripes between 0 and 4),
  category     text not null default 'Adulto Gi',
  plan         text not null default 'Mensal',
  monthly_fee  numeric(10,2) not null default 0,
  status       text not null default 'ativo' check (status in ('ativo','inadimplente','experimental')),
  joined_at    date not null default current_date,
  created_at   timestamptz default now()
);

-- ———————————————————————— Cronograma (aulas semanais) ——————————————————————
create table if not exists public.classes (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null,
  weekday      int  not null check (weekday between 0 and 6), -- 0=Dom .. 6=Sáb
  start_time   time not null,
  end_time     time not null,
  professor_id uuid references public.professors(id) on delete set null,
  capacity     int  not null default 30,
  created_at   timestamptz default now()
);

-- ———————————————————————————————— Presença —————————————————————————————————
-- method: como o check-in foi feito (chamada do professor, QR no tatame, geofence)
create table if not exists public.attendance (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  class_id   uuid references public.classes(id) on delete set null,
  date       date not null default current_date,
  method     text not null check (method in ('professor','qr','geo')),
  created_at timestamptz default now(),
  unique (student_id, class_id, date)
);

-- ——————————————————————— Graduações (faixas e graus) ———————————————————————
create table if not exists public.graduations (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  from_belt  text,
  to_belt    text not null,
  kind       text not null check (kind in ('faixa','grau')),
  date       date, -- null = agendada/pendente
  status     text not null default 'pendente' check (status in ('pendente','concluida')),
  note       text,
  created_at timestamptz default now()
);

-- ——————————————————————————— Financeiro (faturas) ——————————————————————————
create table if not exists public.invoices (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  ref        text not null,        -- ex.: 'Jul/2026'
  due_date   date not null,
  amount     numeric(10,2) not null,
  status     text not null default 'pendente' check (status in ('pago','pendente','atrasado')),
  method     text,                 -- Pix|Cartão|Dinheiro
  paid_at    timestamptz,
  created_at timestamptz default now()
);

-- ———————————————————————————————— Eventos ——————————————————————————————————
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  type        text not null,
  date        date not null,
  time        time,
  location    text,
  description text,
  capacity    int not null default 40,
  created_at  timestamptz default now()
);

create table if not exists public.event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz default now(),
  unique (event_id, student_id)
);

-- ———————————————————————————— Índices úteis ————————————————————————————————
create index if not exists idx_attendance_date    on public.attendance (date);
create index if not exists idx_attendance_student on public.attendance (student_id);
create index if not exists idx_classes_weekday    on public.classes (weekday, start_time);
create index if not exists idx_invoices_student   on public.invoices (student_id);
create index if not exists idx_events_date        on public.events (date);

-- ============================================================================
-- RLS — habilitado em tudo. As policies abaixo são de DESENVOLVIMENTO:
-- liberam acesso total via anon key porque o login real ainda não existe.
-- >>> TROCAR por policies baseadas em auth.uid()/role quando entrar a auth. <<<
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'school_settings','professors','students','classes','attendance',
    'graduations','invoices','events','event_registrations'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format($f$
      create policy "dev_all_%1$s" on public.%1$I
      for all to anon, authenticated using (true) with check (true);
    $f$, t);
  end loop;
end $$;

-- ============== 0002_auth_roles.sql ==============
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

-- BLINDAGEM (defesa contra escalonamento de privilégio):
-- RLS não filtra por coluna, então este trigger impede que um usuário mude o
-- próprio `role` ou re-aponte `student_id` via profiles_self_update.
--   • role só muda pelo Mestre.
--   • student_id só na 1ª vinculação (NULL→valor, via claim_enrollment) ou pelo Mestre.
create or replace function public.protect_profile_columns() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_mestre() then
    raise exception 'Alteração de papel não permitida';
  end if;
  if new.student_id is distinct from old.student_id
     and old.student_id is not null
     and not public.is_mestre() then
    raise exception 'Alteração de matrícula não permitida';
  end if;
  return new;
end $$;

drop trigger if exists protect_profile_columns_trg on public.profiles;
create trigger protect_profile_columns_trg
  before update on public.profiles for each row
  execute function public.protect_profile_columns();

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
