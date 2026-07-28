-- ============================================================
-- 0005 — Aluno entra só com a matrícula (sem Google).
-- App faz signInAnonymously() e chama claim_enrollment(code).
-- Mudança: se o código já estava ligado a outra sessão anônima
-- (aluno trocou de aparelho/limpou o navegador), transfere o vínculo
-- em vez de recusar.
-- ============================================================

create or replace function public.claim_enrollment(p_code text) returns boolean
  language plpgsql security definer set search_path = public as $$
declare s_id uuid;
begin
  select id into s_id from public.students
   where upper(enrollment_code) = upper(trim(p_code));

  if s_id is null then
    return false; -- matrícula inexistente
  end if;

  -- Solta sessões anônimas antigas do mesmo aluno (DELETE não passa
  -- pelo trigger protect_profile_columns, que é BEFORE UPDATE).
  -- profiles tem ON DELETE CASCADE a partir de auth.users.
  delete from auth.users
   where id in (
     select p.id from public.profiles p
      where p.student_id = s_id
        and p.id <> auth.uid()
        and p.role = 'aluno'
   );

  update public.profiles
     set student_id = s_id, role = 'aluno'
   where id = auth.uid();

  return true;
end $$;

grant execute on function public.claim_enrollment(text) to authenticated;
