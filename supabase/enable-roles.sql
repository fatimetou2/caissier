-- Journal partagé + rôles
-- À exécuter dans Supabase → SQL Editor

create or replace function public.is_cash_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@gmail.com';
$$;

drop policy if exists "cash_entries_select_own" on public.cash_entries;
drop policy if exists "cash_entries_insert_own" on public.cash_entries;
drop policy if exists "cash_entries_update_own" on public.cash_entries;
drop policy if exists "cash_entries_delete_own" on public.cash_entries;
drop policy if exists "cash_entries_select_authenticated" on public.cash_entries;
drop policy if exists "cash_entries_insert_authenticated" on public.cash_entries;
drop policy if exists "cash_entries_update_admin" on public.cash_entries;
drop policy if exists "cash_entries_delete_admin" on public.cash_entries;

create policy "cash_entries_select_authenticated"
on public.cash_entries for select
to authenticated
using (true);

create policy "cash_entries_insert_authenticated"
on public.cash_entries for insert
to authenticated
with check (true);

create policy "cash_entries_update_admin"
on public.cash_entries for update
to authenticated
using (public.is_cash_admin())
with check (public.is_cash_admin());

create policy "cash_entries_delete_admin"
on public.cash_entries for delete
to authenticated
using (public.is_cash_admin());
