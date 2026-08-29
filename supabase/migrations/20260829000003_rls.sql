-- ============================================================================
-- TalentBridge :: row-level security
--
-- The threat model that matters: `submissions` holds children's names, birth
-- dates, schools and disability categories. The forms are public and unauthenticated,
-- so the anon role must be able to INSERT -- but it must never be able to read a
-- single row back. The legacy system had no equivalent boundary; the .NET API simply
-- exposed whatever endpoints existed to whoever called them.
-- ============================================================================

alter table public.submissions enable row level security;
alter table public.profiles    enable row level security;

-- --------------------------------------------------------------------------
-- submissions
-- --------------------------------------------------------------------------

-- Anyone may submit a screening. This is the public form.
create policy submissions_insert_public
  on public.submissions
  for insert
  to anon, authenticated
  with check (true);

-- Nobody reads submissions without a session. Note there is deliberately NO select
-- policy for `anon`: with RLS enabled and no matching policy, a read returns zero rows.
create policy submissions_select_staff
  on public.submissions
  for select
  to authenticated
  using ((select public.is_staff()));

-- Corrections and deletions are admin-only. `demo` and `specialist` cannot mutate,
-- which is what makes the public demo account safe to hand out.
create policy submissions_update_admin
  on public.submissions
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy submissions_delete_admin
  on public.submissions
  for delete
  to authenticated
  using ((select public.is_admin()));

-- --------------------------------------------------------------------------
-- profiles
-- --------------------------------------------------------------------------

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  -- A user may edit their own display name but must not promote themselves.
  with check (id = (select auth.uid()) and role = (select public.current_role_name()));

create policy profiles_admin_all
  on public.profiles
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- --------------------------------------------------------------------------
-- Grants
--
-- RLS constrains rows; grants constrain which operations are reachable at all.
-- Revoking UPDATE/DELETE from anon means a policy mistake later cannot expose them.
-- --------------------------------------------------------------------------

revoke all on public.submissions from anon, authenticated;
grant insert on public.submissions to anon, authenticated;
grant select on public.submissions to authenticated;
grant update, delete on public.submissions to authenticated;

revoke all on public.profiles from anon, authenticated;
grant select, update on public.profiles to authenticated;
