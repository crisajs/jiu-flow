-- ============================================================
-- 0004 — Mensalidade fixa R$ 70 + controle pago/não pago por mês.
-- ============================================================

-- Valor fixo para todos (novos e existentes)
alter table public.students alter column monthly_fee set default 70;
update public.students set monthly_fee = 70;

-- Uma fatura por aluno por mês (permite upsert do toggle pago/não pago)
create unique index if not exists invoices_student_ref_key
  on public.invoices (student_id, ref);
