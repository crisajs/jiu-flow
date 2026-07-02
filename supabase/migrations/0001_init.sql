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
