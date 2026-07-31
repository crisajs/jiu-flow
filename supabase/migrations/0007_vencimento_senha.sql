-- ============================================================
-- 0007 — Dia de vencimento por aluno + senha própria do aluno.
-- ============================================================

alter table public.students
  add column if not exists due_day int not null default 10
  check (due_day between 1 and 31);

-- Marca que o aluno já criou senha. A partir daí a matrícula sozinha
-- não entra mais — vira matrícula + senha.
alter table public.students
  add column if not exists password_set boolean not null default false;

-- claim_enrollment: recusa entrada só por matrícula depois que o aluno
-- criou senha (senão a senha não protegeria nada).
create or replace function public.claim_enrollment(p_code text) returns boolean
  language plpgsql security definer set search_path = public as $$
declare s_id uuid; has_pw boolean;
begin
  select id, password_set into s_id, has_pw from public.students
   where upper(enrollment_code) = upper(trim(p_code));

  if s_id is null then
    return false;                       -- matrícula inexistente
  end if;
  if has_pw then
    raise exception 'SENHA_NECESSARIA'; -- já tem senha: precisa usar senha
  end if;

  delete from auth.users
   where id in (
     select p.id from public.profiles p
      where p.student_id = s_id and p.id <> auth.uid() and p.role = 'aluno'
   );

  update public.profiles set student_id = s_id, role = 'aluno' where id = auth.uid();
  return true;
end $$;

-- Aluno marca que criou senha (chamado após supabase.auth.updateUser).
create or replace function public.mark_password_set() returns void
  language plpgsql security definer set search_path = public as $$
begin
  update public.students set password_set = true
   where id = public.current_student_id();
end $$;

grant execute on function public.claim_enrollment(text) to authenticated;
grant execute on function public.mark_password_set() to authenticated;
