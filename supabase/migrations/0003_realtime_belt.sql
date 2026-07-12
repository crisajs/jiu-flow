-- ============================================================
-- 0003 — Realtime (mudanças ao vivo) + aluno edita a própria faixa (validado).
-- ============================================================

-- Atualizações ao vivo nas telas (faixa, presença, eventos). Idempotente.
do $$
declare t text;
begin
  foreach t in array array['students','attendance','events','event_registrations'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I;', t);
    exception when others then null; -- já está na publicação
    end;
  end loop;
end $$;

-- Aluno atualiza a PRÓPRIA faixa/grau — só progressão CONDIZENTE:
--   • mesma faixa, ajustando graus (0–4), OU
--   • exatamente a próxima faixa da trilha (adulto ou infantil).
-- Nunca deixa pular faixa. SECURITY DEFINER: passa pela RLS de forma controlada.
create or replace function public.set_my_belt(p_belt text, p_stripes int) returns void
  language plpgsql security definer set search_path = public as $$
declare
  sid uuid;
  cur_belt text;
  adult text[] := array['branca','azul','roxa','marrom','preta'];
  kid   text[] := array['branca','cinza','amarela','laranja','verde'];
  allowed text[];
  ia int; ik int;
begin
  sid := public.current_student_id();
  if sid is null then raise exception 'Sem matrícula vinculada'; end if;
  if p_stripes < 0 or p_stripes > 4 then raise exception 'Graus inválidos (0 a 4)'; end if;

  select belt into cur_belt from public.students where id = sid;
  if cur_belt is null then raise exception 'Aluno não encontrado'; end if;

  -- monta a lista de faixas permitidas: a atual + a próxima em cada trilha
  allowed := array[cur_belt];
  ia := array_position(adult, cur_belt);
  ik := array_position(kid, cur_belt);
  if ia is not null and ia < array_length(adult, 1) then allowed := allowed || adult[ia + 1]; end if;
  if ik is not null and ik < array_length(kid, 1) then allowed := allowed || kid[ik + 1]; end if;

  if not (p_belt = any(allowed)) then
    raise exception 'Só é permitido manter a faixa atual ou avançar para a próxima';
  end if;

  update public.students set belt = p_belt, stripes = p_stripes where id = sid;
end $$;

grant execute on function public.set_my_belt(text, int) to authenticated;
