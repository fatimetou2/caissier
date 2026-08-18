-- Auth: chaque utilisateur ne voit que ses propres écritures

alter table public.cash_entries
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists cash_entries_user_id_idx
  on public.cash_entries (user_id);

create or replace function public.set_cash_entry_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.user_id = auth.uid();
  return new;
end;
$$;

drop trigger if exists cash_entries_set_user_id on public.cash_entries;
create trigger cash_entries_set_user_id
before insert on public.cash_entries
for each row
execute procedure public.set_cash_entry_user_id();

drop policy if exists "cash_entries_select_all" on public.cash_entries;
drop policy if exists "cash_entries_insert_all" on public.cash_entries;
drop policy if exists "cash_entries_update_all" on public.cash_entries;
drop policy if exists "cash_entries_delete_all" on public.cash_entries;

create policy "cash_entries_select_own"
on public.cash_entries for select
to authenticated
using (user_id = auth.uid() or user_id is null);

create policy "cash_entries_insert_own"
on public.cash_entries for insert
to authenticated
with check (user_id = auth.uid());

create policy "cash_entries_update_own"
on public.cash_entries for update
to authenticated
using (user_id = auth.uid() or user_id is null)
with check (user_id = auth.uid());

create policy "cash_entries_delete_own"
on public.cash_entries for delete
to authenticated
using (user_id = auth.uid() or user_id is null);
