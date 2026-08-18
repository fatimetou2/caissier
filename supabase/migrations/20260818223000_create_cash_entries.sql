-- دفتر الصندوق — جدول الحركات النقدية

create table if not exists public.cash_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  type text not null,
  amount numeric not null,
  party text,
  reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cash_entries_type_check check (type in ('in', 'out')),
  constraint cash_entries_amount_positive check (amount > 0)
);

create index if not exists cash_entries_date_idx on public.cash_entries (date);
create index if not exists cash_entries_created_at_idx on public.cash_entries (created_at);

create or replace function public.set_cash_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cash_entries_set_updated_at on public.cash_entries;
create trigger cash_entries_set_updated_at
before update on public.cash_entries
for each row
execute procedure public.set_cash_entries_updated_at();

alter table public.cash_entries enable row level security;

drop policy if exists "cash_entries_select_all" on public.cash_entries;
drop policy if exists "cash_entries_insert_all" on public.cash_entries;
drop policy if exists "cash_entries_update_all" on public.cash_entries;
drop policy if exists "cash_entries_delete_all" on public.cash_entries;

create policy "cash_entries_select_all"
on public.cash_entries for select
using (true);

create policy "cash_entries_insert_all"
on public.cash_entries for insert
with check (true);

create policy "cash_entries_update_all"
on public.cash_entries for update
using (true)
with check (true);

create policy "cash_entries_delete_all"
on public.cash_entries for delete
using (true);

insert into public.cash_entries (date, type, amount)
select v.date, v.type, v.amount
from (
  values
    ('2026-08-01'::date, 'in', 100000),
    ('2026-08-03'::date, 'out', 20000),
    ('2026-08-05'::date, 'in', 50000)
) as v(date, type, amount)
where not exists (select 1 from public.cash_entries);
