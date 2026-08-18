-- إلغاء الحركات دون حذفها من قاعدة البيانات

alter table public.cash_entries
  add column if not exists status text not null default 'active';

alter table public.cash_entries
  add column if not exists cancelled_at timestamptz;

alter table public.cash_entries
  add column if not exists cancel_reason text;

alter table public.cash_entries
  drop constraint if exists cash_entries_status_check;

alter table public.cash_entries
  add constraint cash_entries_status_check
  check (status in ('active', 'cancelled'));

update public.cash_entries
set status = 'active'
where status is null or status not in ('active', 'cancelled');
