-- ============================================================
-- 0006 — Papel da equipe vem do E-MAIL, não da conta.
-- Recriar a conta (ou entrar por outro provedor) não perde mais o acesso.
-- ============================================================

create table if not exists public.staff_emails (
  email text primary key,
  role  text not null default 'mestre' check (role in ('mestre','adm'))
);
alter table public.staff_emails enable row level security;

-- Só o Mestre lê/edita a lista
drop policy if exists staff_emails_mestre on public.staff_emails;
create policy staff_emails_mestre on public.staff_emails for all to authenticated
  using (public.is_mestre()) with check (public.is_mestre());

insert into public.staff_emails (email, role) values
  ('xbjjschool@gmail.com',     'mestre'),
  ('edu.allves1460@gmail.com', 'mestre')
on conflict (email) do update set role = excluded.role;

-- Usuário novo nasce com o papel da lista (senão, aluno)
create or replace function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
declare r text;
begin
  select s.role into r from public.staff_emails s
   where lower(s.email) = lower(new.email);

  insert into public.profiles (id, role, full_name, phone)
  values (new.id, coalesce(r, 'aluno'), new.raw_user_meta_data ->> 'full_name', new.phone)
  on conflict (id) do update set role = coalesce(r, public.profiles.role);

  return new;
end $$;

-- Corrige contas que já existem
alter table public.profiles disable trigger protect_profile_columns_trg;

update public.profiles p
   set role = s.role
  from auth.users u, public.staff_emails s
 where p.id = u.id and lower(u.email) = lower(s.email);

alter table public.profiles enable trigger protect_profile_columns_trg;

-- Quem existe hoje e com que papel
select u.email, p.role from public.profiles p
join auth.users u on u.id = p.id
order by p.role, u.email;
